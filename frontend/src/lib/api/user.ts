import { z } from 'zod';
import { apiRequest } from './client';
import { validationError } from './errors';
import {
	changePasswordInputSchema,
	patchUserInputSchema,
	userSchema,
	type ChangePasswordInput,
	type PatchUserInput,
	type User
} from './schemas/user';

export function getMe(): Promise<User> {
	return apiRequest({ method: 'GET', path: '/api/user/me', responseSchema: userSchema });
}

export function updateMe(input: PatchUserInput): Promise<User> {
	const parsed = patchUserInputSchema.safeParse(input);
	if (!parsed.success) throw validationError(parsed.error);
	return apiRequest({
		method: 'PATCH',
		path: '/api/user/me',
		body: parsed.data,
		responseSchema: userSchema
	});
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
	const parsed = changePasswordInputSchema.safeParse(input);
	if (!parsed.success) throw validationError(parsed.error);
	await apiRequest({
		method: 'PATCH',
		path: '/api/user/me/password',
		body: parsed.data,
		responseSchema: z.null()
	});
}

export async function deleteMe(): Promise<void> {
	await apiRequest({ method: 'DELETE', path: '/api/user/me', responseSchema: z.null() });
}
