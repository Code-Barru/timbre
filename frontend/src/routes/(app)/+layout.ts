import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { authState } from '$lib/state/auth.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, url }) => {
	await parent();
	if (authState.status !== 'authenticated') {
		const from = encodeURIComponent(url.pathname + url.search);
		redirect(307, resolve(`/auth/login?redirectTo=${from}`));
	}
};
