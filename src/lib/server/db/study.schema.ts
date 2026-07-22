import { relations } from 'drizzle-orm';
import {
	pgTable,
	pgEnum,
	text,
	timestamp,
	integer,
	real,
	bigserial,
	jsonb,
	index
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const cardTypeEnum = pgEnum('card_type', ['basic', 'cloze', 'minimal_pair']);
export const cardStateEnum = pgEnum('card_state', ['new', 'learning', 'review', 'relearning']);
export const reviewGradeEnum = pgEnum('review_grade', ['again', 'hard', 'good', 'easy']);

export const deck = pgTable(
	'deck',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		description: text('description'),
		ownerId: text('owner_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		language: text('language').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('deck_owner_idx').on(table.ownerId)]
);

export const card = pgTable(
	'card',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		deckId: text('deck_id')
			.notNull()
			.references(() => deck.id, { onDelete: 'cascade' }),
		type: cardTypeEnum('type').notNull(),
		payload: jsonb('payload').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('card_deck_idx').on(table.deckId)]
);

export const cardState = pgTable(
	'card_state',
	{
		cardId: text('card_id')
			.primaryKey()
			.references(() => card.id, { onDelete: 'cascade' }),
		due: timestamp('due').defaultNow().notNull(),
		stability: real('stability').notNull().default(0),
		difficulty: real('difficulty').notNull().default(0),
		elapsed_days: integer('elapsed_days').notNull().default(0),
		scheduled_days: integer('scheduled_days').notNull().default(0),
		reps: integer('reps').notNull().default(0),
		state: cardStateEnum('state').notNull().default('new'),
		lapses: integer('lapses').notNull().default(0),
		lastReviewedAt: timestamp('last_reviewed_at'),
	},
	(table) => [
		index('card_state_due_idx').on(table.due)
	]
);

export const reviewLog = pgTable(
	'review_log',
	{
		id: bigserial('id', { mode: 'number' }).primaryKey(),
		cardId: text('card_id')
			.notNull()
			.references(() => card.id, { onDelete: 'cascade' }),
		// dénormalisé depuis card.deckId pour éviter une jointure sur les stats par deck
		deckId: text('deck_id')
			.notNull()
			.references(() => deck.id, { onDelete: 'cascade' }),
		reviewedAt: timestamp('reviewed_at').defaultNow().notNull(),
		grade: reviewGradeEnum('grade').notNull(),
		difficultyBefore: real('difficulty_before').notNull(),
		difficultyAfter: real('difficulty_after').notNull(),
		scheduledDaysBefore: integer('scheduled_days_before').notNull(),
		scheduledDaysAfter: integer('scheduled_days_after').notNull(),
		stabilityBefore: real('stability_before').notNull(),
		stabilityAfter: real('stability_after').notNull(),
	},
	(table) => [
		index('review_log_card_idx').on(table.cardId),
		index('review_log_deck_reviewed_idx').on(table.deckId, table.reviewedAt),
		index('review_log_reviewed_idx').on(table.reviewedAt)
	]
);

export const deckRelations = relations(deck, ({ one, many }) => ({
	owner: one(user, {
		fields: [deck.ownerId],
		references: [user.id]
	}),
	cards: many(card)
}));

export const cardRelations = relations(card, ({ one, many }) => ({
	deck: one(deck, {
		fields: [card.deckId],
		references: [deck.id]
	}),
	state: one(cardState, {
		fields: [card.id],
		references: [cardState.cardId]
	}),
	reviews: many(reviewLog)
}));

export const cardStateRelations = relations(cardState, ({ one }) => ({
	card: one(card, {
		fields: [cardState.cardId],
		references: [card.id]
	})
}));

export const reviewLogRelations = relations(reviewLog, ({ one }) => ({
	card: one(card, {
		fields: [reviewLog.cardId],
		references: [card.id]
	}),
	deck: one(deck, {
		fields: [reviewLog.deckId],
		references: [deck.id]
	})
}));
