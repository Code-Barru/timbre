import { z } from 'zod';

// Source of truth for the review_grade_enum Postgres type.
// Order matters: the index of a grade is its ts-fsrs Rating minus one.
export const REVIEW_GRADES = ['again', 'hard', 'good', 'easy'] as const;

export const reviewGradeSchema = z.enum(REVIEW_GRADES);

export type ReviewGrade = z.infer<typeof reviewGradeSchema>;
