import { apiRequest } from './client';
import { validationError } from './errors';
import {
	patchPreferencesInputSchema,
	userPreferencesSchema,
	type PatchPreferencesInput,
	type UserPreferences
} from './schemas/preferences';

export function getPreferences(): Promise<UserPreferences> {
	return apiRequest({
		method: 'GET',
		path: '/api/user/me/preferences',
		responseSchema: userPreferencesSchema
	});
}

export function updatePreferences(input: PatchPreferencesInput): Promise<UserPreferences> {
	const parsed = patchPreferencesInputSchema.safeParse(input);
	if (!parsed.success) throw validationError(parsed.error);
	return apiRequest({
		method: 'PATCH',
		path: '/api/user/me/preferences',
		body: parsed.data,
		responseSchema: userPreferencesSchema
	});
}
