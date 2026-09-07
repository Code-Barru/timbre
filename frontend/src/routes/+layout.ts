import { fetchMe } from '$lib/state/auth.svelte';

export const prerender = true;
export const ssr = false;

export async function load() {
	await fetchMe();
}
