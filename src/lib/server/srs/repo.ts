import { and, asc, desc, eq, lte } from 'drizzle-orm';
import { db } from '../db';
import { card, cardState, deck, reviewLog } from '../db/study.schema';
import type { CardPayloadMap, CardType } from '$lib/schemas/card';
import type { ReviewGrade } from '$lib/schemas/review';
import { emptyCardState, rollbackReview, scheduleReview } from './scheduling';
import { logToRow } from './mapping';

// Every function takes the acting userId and joins on deck.ownerId, so a caller
// that forgets its own check still cannot touch another user's cards.
// Missing and not-owned both raise the same error: no existence oracle.

// Generic so type and payload stay correlated: CardPayload is the union of all
// three shapes, so a plain annotation would accept a cloze payload on a basic card.
export async function createCard<T extends CardType>(
	userId: string,
	input: { deckId: string; type: T; payload: CardPayloadMap[T] }
) {
	const now = new Date();

	return db.transaction(async (tx) => {
		const [owned] = await tx
			.select({ id: deck.id })
			.from(deck)
			.where(and(eq(deck.id, input.deckId), eq(deck.ownerId, userId)));
		if (!owned) throw new Error(`deck not found: ${input.deckId}`);

		const [row] = await tx.insert(card).values(input).returning();
		await tx.insert(cardState).values({
			cardId: row.id,
			deckId: row.deckId,
			...emptyCardState(now)
		});
		return row;
	});
}

export async function reviewCard(userId: string, cardId: string, grade: ReviewGrade) {
	const now = new Date();

	return db.transaction(async (tx) => {
		const [row] = await tx
			.select({ state: cardState })
			.from(cardState)
			.innerJoin(deck, eq(deck.id, cardState.deckId))
			.where(and(eq(cardState.cardId, cardId), eq(deck.ownerId, userId)))
			.for('update', { of: cardState });
		if (!row) throw new Error(`card not found: ${cardId}`);

		const { state: next, log } = scheduleReview(row.state, grade, now);

		await tx.update(cardState).set(next).where(eq(cardState.cardId, cardId));
		await tx.insert(reviewLog).values({ cardId, deckId: row.state.deckId, ...logToRow(log) });

		return next;
	});
}

export async function undoLastReview(userId: string, cardId: string) {
	return db.transaction(async (tx) => {
		const [row] = await tx
			.select({ state: cardState })
			.from(cardState)
			.innerJoin(deck, eq(deck.id, cardState.deckId))
			.where(and(eq(cardState.cardId, cardId), eq(deck.ownerId, userId)))
			.for('update', { of: cardState });
		if (!row) throw new Error(`card not found: ${cardId}`);

		const [last, previous] = await tx
			.select()
			.from(reviewLog)
			.where(eq(reviewLog.cardId, cardId))
			.orderBy(desc(reviewLog.id))
			.limit(2);
		if (!last) throw new Error(`nothing to undo: ${cardId}`);

		const restored = rollbackReview(row.state, last);

		await tx
			.update(cardState)
			.set({ ...restored, lastReviewedAt: previous?.reviewedAt ?? null })
			.where(eq(cardState.cardId, cardId));
		await tx.delete(reviewLog).where(eq(reviewLog.id, last.id));

		return restored;
	});
}

export function getQueue(userId: string, deckId: string, limit = 50) {
	return db
		.select({ card, state: cardState })
		.from(cardState)
		.innerJoin(card, eq(card.id, cardState.cardId))
		.innerJoin(deck, eq(deck.id, cardState.deckId))
		.where(
			and(eq(cardState.deckId, deckId), eq(deck.ownerId, userId), lte(cardState.due, new Date()))
		)
		.orderBy(asc(cardState.due))
		.limit(limit);
}
