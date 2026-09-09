import { apiRequest } from './client';
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
	const body = patchPreferencesInputSchema.parse(input);
	return apiRequest({
		method: 'PATCH',
		path: '/api/user/me/preferences',
		body,
		responseSchema: userPreferencesSchema
	});
}
