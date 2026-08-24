import { z } from 'zod';
import { hasPasswordComplexity } from './password';

export const userSchema = z.object({
	email: z.email(),
	displayName: z.string(),
	isAdmin: z.boolean(),
	timezone: z.string()
});

export type User = z.infer<typeof userSchema>;

export const patchUserInputSchema = z.object({
	email: z.email().optional(),
	displayName: z.string().min(1).max(25).optional(),
	timezone: z.string().optional()
});

export type PatchUserInput = z.infer<typeof patchUserInputSchema>;

export const changePasswordInputSchema = z.object({
	oldPassword: z.string(),
	newPassword: z
		.string()
		.min(8, 'Password must be between 8 and 50 characters')
		.max(50, 'Password must be between 8 and 50 characters')
		.refine(hasPasswordComplexity, {
			message: 'Password must contain at least one lowercase, one uppercase letter, and one digit'
		})
});

export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
