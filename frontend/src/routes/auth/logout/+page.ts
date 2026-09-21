import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { logout } from '$lib/state/auth.svelte';

export async function load() {
	await logout();
	redirect(307, resolve('/auth/login'));
}
