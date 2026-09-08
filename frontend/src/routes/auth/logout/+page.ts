import { redirect } from '@sveltejs/kit';

export async function load({ fetch }) {
	await fetch('/api/auth/logout', {
		method: 'POST'
	});
	throw redirect(302, '/auth/login');
}
