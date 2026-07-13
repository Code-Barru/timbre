import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { signInSchema } from '$lib/schemas/auth';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const parsed = signInSchema.safeParse({
			email: formData.get('email')?.toString() ?? '',
			password: formData.get('password')?.toString() ?? ''
		});

		if (!parsed.success) {
			return fail(400, { message: parsed.error.issues[0].message });
		}
		const { email, password } = parsed.data;

		try {
			await auth.api.signInEmail({
				body: { email, password }
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message });
			}
			return fail(500, { message: 'auth_error_generic' });
		}

		return redirect(302, '/');
	}
};
