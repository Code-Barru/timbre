import type { InferSelectModel } from 'drizzle-orm';
import type { Card as FsrsCard, ReviewLog as FsrsLog, Grade, State } from 'ts-fsrs';
import { cardState, cardStateEnum, reviewLog } from '../db/study.schema';
import { REVIEW_GRADES, type ReviewGrade } from '$lib/schemas/review';

// Both arrays are indexed by the matching ts-fsrs numeric enum, so their order
// is load-bearing. mapping.test.ts pins it.
const STATES = cardStateEnum.enumValues;
const GRADES = REVIEW_GRADES;

export type StateRow = InferSelectModel<typeof cardState>;
export type LogRow = InferSelectModel<typeof reviewLog>;

// The scheduling fields only: no cardId/deckId, so the scheduler stays DB-agnostic.
export type SrsCardState = Omit<StateRow, 'cardId' | 'deckId'>;

export const toRating = (g: ReviewGrade): Grade => (GRADES.indexOf(g) + 1) as Grade;

export const toCard = (r: SrsCardState): FsrsCard => ({
	due: r.due,
	stability: r.stability,
	difficulty: r.difficulty,
	elapsed_days: r.elapsedDays,
	scheduled_days: r.scheduledDays,
	learning_steps: r.learningSteps,
	reps: r.reps,
	lapses: r.lapses,
	state: STATES.indexOf(r.state) as State,
	last_review: r.lastReviewedAt ?? undefined
});

export const cardToRow = (c: FsrsCard) => ({
	due: c.due,
	stability: c.stability,
	difficulty: c.difficulty,
	elapsedDays: c.elapsed_days,
	scheduledDays: c.scheduled_days,
	learningSteps: c.learning_steps,
	reps: c.reps,
	lapses: c.lapses,
	state: STATES[c.state],
	lastReviewedAt: c.last_review ?? null
});

export const toLog = (r: LogRow): FsrsLog => ({
	rating: toRating(r.grade),
	state: STATES.indexOf(r.state) as State,
	due: r.due,
	stability: r.stability,
	difficulty: r.difficulty,
	elapsed_days: r.elapsedDays,
	last_elapsed_days: r.lastElapsedDays,
	scheduled_days: r.scheduledDays,
	learning_steps: r.learningSteps,
	review: r.reviewedAt
});

export const logToRow = (l: FsrsLog) => ({
	grade: GRADES[l.rating - 1],
	state: STATES[l.state],
	due: l.due,
	stability: l.stability,
	difficulty: l.difficulty,
	elapsedDays: l.elapsed_days,
	lastElapsedDays: l.last_elapsed_days,
	scheduledDays: l.scheduled_days,
	learningSteps: l.learning_steps,
	reviewedAt: l.review
});
