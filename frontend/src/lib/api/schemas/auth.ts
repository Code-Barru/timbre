import { z } from 'zod';
import { hasPasswordComplexity } from './password';

export const registerInputSchema = z.object({
	email: z.email(),
	displayName: z.string().min(1).max(25),
	password: z
		.string()
		.min(8, 'Password must be between 8 and 50 characters')
		.max(50, 'Password must be between 8 and 50 characters')
		.refine(hasPasswordComplexity, {
			message: 'Password must contain at least one lowercase, one uppercase letter, and one digit'
		}),
	timezone: z.string()
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
	email: z.email(),
	password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;
