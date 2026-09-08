import { z } from 'zod';
import { apiRequest } from './client';
import { validationError } from './errors';
import {
	loginInputSchema,
	registerInputSchema,
	type LoginInput,
	type RegisterInput
} from './schemas/auth';
import { userSchema, type User } from './schemas/user';

export function register(input: RegisterInput): Promise<User> {
	const parsed = registerInputSchema.safeParse(input);
	if (!parsed.success) throw validationError(parsed.error);
	return apiRequest({
		method: 'POST',
		path: '/api/auth/register',
		body: parsed.data,
		responseSchema: userSchema
	});
}

export function login(input: LoginInput): Promise<User> {
	const parsed = loginInputSchema.safeParse(input);
	if (!parsed.success) throw validationError(parsed.error);
	return apiRequest({
		method: 'POST',
		path: '/api/auth/login',
		body: parsed.data,
		responseSchema: userSchema
	});
}

export function logout(): Promise<void> {
	return apiRequest({ method: 'POST', path: '/api/auth/logout', responseSchema: z.void() });
}
