import { getPreferences } from '$api/preferences';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return { preferences: await getPreferences() };
};
