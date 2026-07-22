import { relations } from 'drizzle-orm';
import {
	pgTable,
	pgEnum,
	text,
	timestamp,
	integer,
	bigint,
	doublePrecision,
	jsonb,
	index,
	unique,
	foreignKey
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema';
// Relative, not $lib: drizzle-kit loads this file outside Vite, where the alias
// does not resolve. The zod schemas are the source of truth for these values.
import { CARD_TYPES, type CardPayload } from '../../schemas/card';
import { REVIEW_GRADES } from '../../schemas/review';

const tstz = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' });

export const cardTypeEnum = pgEnum('card_type_enum', CARD_TYPES);
export const cardStateEnum = pgEnum('card_state_enum', ['new', 'learning', 'review', 'relearning']);
export const reviewGradeEnum = pgEnum('review_grade_enum', REVIEW_GRADES);

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
		createdAt: tstz('created_at').defaultNow().notNull(),
		updatedAt: tstz('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(t) => [index('deck_owner_idx').on(t.ownerId)]
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
		payload: jsonb('payload').$type<CardPayload>().notNull(),
		createdAt: tstz('created_at').defaultNow().notNull(),
		updatedAt: tstz('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(t) => [unique('card_deck_id_id_unique').on(t.deckId, t.id)]
);

export const cardState = pgTable(
	'card_state',
	{
		cardId: text('card_id').primaryKey(),
		deckId: text('deck_id').notNull(),
		due: tstz('due').defaultNow().notNull(),
		stability: doublePrecision('stability').notNull().default(0),
		difficulty: doublePrecision('difficulty').notNull().default(0),
		elapsedDays: integer('elapsed_days').notNull().default(0),
		scheduledDays: integer('scheduled_days').notNull().default(0),
		learningSteps: integer('learning_steps').notNull().default(0),
		reps: integer('reps').notNull().default(0),
		lapses: integer('lapses').notNull().default(0),
		state: cardStateEnum('state').notNull().default('new'),
		lastReviewedAt: tstz('last_reviewed_at')
	},
	(t) => [
		foreignKey({
			columns: [t.deckId, t.cardId],
			foreignColumns: [card.deckId, card.id],
			name: 'card_state_card_fk'
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		index('card_state_deck_due_idx').on(t.deckId, t.due)
	]
);

export const reviewLog = pgTable(
	'review_log',
	{
		id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
		cardId: text('card_id')
			.notNull()
			.references(() => card.id, { onDelete: 'cascade' }),
		deckId: text('deck_id')
			.notNull()
			.references(() => deck.id, { onDelete: 'cascade' }),
		reviewedAt: tstz('reviewed_at').defaultNow().notNull(),
		grade: reviewGradeEnum('grade').notNull(),
		state: cardStateEnum('state').notNull(),
		due: tstz('due').notNull(),
		stability: doublePrecision('stability').notNull(),
		difficulty: doublePrecision('difficulty').notNull(),
		elapsedDays: integer('elapsed_days').notNull(),
		lastElapsedDays: integer('last_elapsed_days').notNull(),
		scheduledDays: integer('scheduled_days').notNull(),
		learningSteps: integer('learning_steps').notNull().default(0)
	},
	(t) => [
		index('review_log_card_reviewed_idx').on(t.cardId, t.reviewedAt),
		index('review_log_deck_reviewed_idx').on(t.deckId, t.reviewedAt)
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
	}),
	deck: one(deck, {
		fields: [cardState.deckId],
		references: [deck.id]
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
