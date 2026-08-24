import { z } from 'zod';
import { apiRequest } from './client';
import {
	loginInputSchema,
	registerInputSchema,
	type LoginInput,
	type RegisterInput
} from './schemas/auth';
import { userSchema, type User } from './schemas/user';

export function register(input: RegisterInput): Promise<User> {
	const body = registerInputSchema.parse(input);
	return apiRequest({
		method: 'POST',
		path: '/api/auth/register',
		body,
		responseSchema: userSchema
	});
}

export function login(input: LoginInput): Promise<User> {
	const body = loginInputSchema.parse(input);
	return apiRequest({ method: 'POST', path: '/api/auth/login', body, responseSchema: userSchema });
}

export function logout(): Promise<void> {
	return apiRequest({ method: 'POST', path: '/api/auth/logout', responseSchema: z.void() });
}
