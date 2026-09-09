import { z } from 'zod';

const stepsSchema = z.array(z.number().int().positive()).nonempty();

export const userPreferencesSchema = z.object({
	newPerDay: z.number().int().min(0),
	reviewsPerDay: z.number().int().min(0),
	learningStepsMin: z.array(z.number().int()),
	relearningStepsMin: z.array(z.number().int()),
	maxIntervalDays: z.number().int().positive(),
	desiredRetention: z.number().min(0.7).max(0.99),
	burySiblings: z.boolean(),
	maxNewPerGroupPerDay: z.number().int().min(0),
	ui: z.unknown()
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const patchPreferencesInputSchema = z.object({
	newPerDay: z.number().int().min(0).optional(),
	reviewsPerDay: z.number().int().min(0).optional(),
	learningStepsMin: stepsSchema.optional(),
	relearningStepsMin: stepsSchema.optional(),
	maxIntervalDays: z.number().int().positive().optional(),
	desiredRetention: z.number().min(0.7).max(0.99).optional(),
	burySiblings: z.boolean().optional(),
	maxNewPerGroupPerDay: z.number().int().min(0).optional(),
	ui: z.unknown().optional()
});

export type PatchPreferencesInput = z.infer<typeof patchPreferencesInputSchema>;
