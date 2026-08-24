import { z } from 'zod';
import { apiRequest } from './client';
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
	const body = patchUserInputSchema.parse(input);
	return apiRequest({ method: 'PATCH', path: '/api/user/me', body, responseSchema: userSchema });
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
	const body = changePasswordInputSchema.parse(input);
	await apiRequest({
		method: 'PATCH',
		path: '/api/user/me/password',
		body,
		responseSchema: z.null()
	});
}

export async function deleteMe(): Promise<void> {
	await apiRequest({ method: 'DELETE', path: '/api/user/me', responseSchema: z.null() });
}
