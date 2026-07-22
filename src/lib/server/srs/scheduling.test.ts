import { describe, it, expect } from 'vitest';
import type { ReviewGrade } from '$lib/schemas/review';
import { emptyCardState, rollbackReview, scheduleReview } from './scheduling';
import { logToRow, type LogRow, type SrsCardState } from './mapping';

const NOW = new Date('2026-01-01T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;
const GRADES: ReviewGrade[] = ['again', 'hard', 'good', 'easy'];

const NEW_CARD_STATE = { again: 'learning', hard: 'learning', good: 'learning', easy: 'review' };

/** A card that has already graduated and is due today. */
const matureCard = (): SrsCardState => ({
	due: NOW,
	stability: 10,
	difficulty: 5,
	elapsedDays: 10,
	scheduledDays: 10,
	learningSteps: 0,
	reps: 5,
	lapses: 0,
	state: 'review',
	lastReviewedAt: new Date(NOW.getTime() - 10 * DAY)
});

describe('scheduleReview — new card', () => {
	for (const grade of GRADES) {
		it(`schedules a new card graded "${grade}"`, () => {
			const { state, log } = scheduleReview(null, grade, NOW);

			expect(state.due.getTime()).toBeGreaterThan(NOW.getTime());
			expect(state.reps).toBe(1);
			expect(state.stability).toBeGreaterThan(0);
			expect(state.difficulty).toBeGreaterThan(0);
			expect(state.lastReviewedAt).toEqual(NOW);
			expect(state.state).toBe(NEW_CARD_STATE[grade]);
			expect(log.rating).toBe(GRADES.indexOf(grade) + 1);
		});
	}

	it('orders due dates again <= hard <= good <= easy', () => {
		const due = GRADES.map((g) => scheduleReview(null, g, NOW).state.due.getTime());
		expect(due[0]).toBeLessThanOrEqual(due[1]);
		expect(due[1]).toBeLessThanOrEqual(due[2]);
		expect(due[2]).toBeLessThanOrEqual(due[3]);
	});

	it('treats a null state like an explicit empty card state', () => {
		for (const grade of GRADES) {
			expect(scheduleReview(null, grade, NOW)).toEqual(
				scheduleReview(emptyCardState(NOW), grade, NOW)
			);
		}
	});
});

describe('scheduleReview — existing review card', () => {
	it('demotes to relearning on "again"', () => {
		const before = matureCard();
		const { state } = scheduleReview(before, 'again', NOW);

		expect(state.state).toBe('relearning');
		expect(state.lapses).toBe(before.lapses + 1);
		expect(state.stability).toBeLessThan(before.stability);
	});

	for (const grade of ['hard', 'good', 'easy'] as const) {
		it(`keeps the card in review on "${grade}"`, () => {
			const before = matureCard();
			const { state } = scheduleReview(before, grade, NOW);

			expect(state.state).toBe('review');
			expect(state.lapses).toBe(before.lapses);
			expect(state.reps).toBe(before.reps + 1);
			expect(state.stability).toBeGreaterThan(before.stability);
			expect(state.due.getTime()).toBeGreaterThan(NOW.getTime());
		});
	}

	it('grows the interval with the grade', () => {
		const days = (['hard', 'good', 'easy'] as const).map(
			(g) => scheduleReview(matureCard(), g, NOW).state.scheduledDays
		);
		expect(days[0]).toBeLessThan(days[1]);
		expect(days[1]).toBeLessThan(days[2]);
	});

	// Leans on a ts-fsrs implementation detail: fuzz is seeded from the card's own
	// fields (DefaultInitSeedStrategy), not from Math.random. If this ever fails,
	// that strategy changed — see StrategyMode.Seed in ts-fsrs.
	it('is deterministic despite fuzz being enabled', () => {
		for (const grade of GRADES) {
			expect(scheduleReview(matureCard(), grade, NOW)).toEqual(
				scheduleReview(matureCard(), grade, NOW)
			);
		}
	});
});

describe('rollbackReview', () => {
	/**
	 * The review_log row the repo would persist. Goes through logToRow so the
	 * rating/grade index shift is exercised on the way out and back in.
	 */
	const logRowFrom = (before: SrsCardState, grade: ReviewGrade): LogRow => {
		const { log } = scheduleReview(before, grade, NOW);
		return { id: 1, cardId: 'card-1', deckId: 'deck-1', ...logToRow(log) };
	};

	for (const grade of GRADES) {
		it(`undoes a "${grade}" review`, () => {
			const before = matureCard();
			const { state: after } = scheduleReview(before, grade, NOW);
			const restored = rollbackReview(after, logRowFrom(before, grade));

			expect(restored.state).toBe(before.state);
			expect(restored.stability).toBeCloseTo(before.stability);
			expect(restored.difficulty).toBeCloseTo(before.difficulty);
			expect(restored.reps).toBe(before.reps);
			expect(restored.lapses).toBe(before.lapses);
			expect(restored.due).toEqual(before.due);
		});
	}
});
