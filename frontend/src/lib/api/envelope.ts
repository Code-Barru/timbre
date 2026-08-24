import { z } from 'zod';

export function successEnvelope<T extends z.ZodType>(dataSchema: T) {
	return z.object({
		success: z.literal(true),
		data: dataSchema
	});
}

export const errorEnvelopeSchema = z.object({
	success: z.literal(false),
	error: z.object({
		message: z.string(),
		data: z.record(z.string(), z.array(z.string())).optional()
	})
});
