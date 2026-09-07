import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { authState } from '$lib/state/auth.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	await parent();
	if (authState.status === 'authenticated') redirect(307, resolve('/'));
};
