import { fsrs, generatorParameters, createEmptyCard } from 'ts-fsrs';
import type { ReviewGrade } from '$lib/schemas/review';
import { toCard, cardToRow, toRating, toLog, type LogRow, type SrsCardState } from './mapping';

export const SRS_PARAMS = generatorParameters({
	request_retention: 0.9,
	maximum_interval: 36500,
	enable_fuzz: true
});

const scheduler = fsrs(SRS_PARAMS);

/** State of a brand new card, in database row shape. */
export const emptyCardState = (now: Date) => cardToRow(createEmptyCard(now));

/**
 * Pure: no database access, no implicit clock.
 * A null state means a brand new card.
 * Returns the log alongside the state because both come from the same computation.
 */
export function scheduleReview(
	state: SrsCardState | null | undefined,
	grade: ReviewGrade,
	now: Date
) {
	const current = state ? toCard(state) : createEmptyCard(now);
	const { card, log } = scheduler.next(current, now, toRating(grade));
	return { state: cardToRow(card), log };
}

/** Inverse of scheduleReview: the state the card held before `log` was recorded. */
export function rollbackReview(state: SrsCardState, log: LogRow) {
	return cardToRow(scheduler.rollback(toCard(state), toLog(log)));
}
