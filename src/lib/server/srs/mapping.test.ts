import { describe, it, expect } from 'vitest';
import { Rating, State } from 'ts-fsrs';
import { cardStateEnum } from '../db/study.schema';
import { REVIEW_GRADES } from '$lib/schemas/review';

// mapping.ts converts between our string enums and the ts-fsrs numeric ones by
// array index. Nothing in the type system enforces that; these tests do.
describe('enum order', () => {
	it('indexes card states by their ts-fsrs State', () => {
		expect(cardStateEnum.enumValues).toEqual(['new', 'learning', 'review', 'relearning']);
		expect([State.New, State.Learning, State.Review, State.Relearning]).toEqual([0, 1, 2, 3]);
	});

	it('indexes review grades by their ts-fsrs Rating, offset by one', () => {
		expect(REVIEW_GRADES).toEqual(['again', 'hard', 'good', 'easy']);
		expect([Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]).toEqual([1, 2, 3, 4]);
	});
});
