import { login as apiLogin, logout as apiLogout, register as apiRegister } from '$api/auth';
import { ApiError } from '$api/errors';
import type { LoginInput, RegisterInput } from '$api/schemas/auth';
import type { ChangePasswordInput, PatchUserInput, User } from '$api/schemas/user';
import { changePassword as apiChangePassword, getMe, updateMe } from '$api/user';

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export const authState = $state<{ user: User | null; status: Status; error: string | null }>({
	user: null,
	status: 'idle',
	error: null
});

const _isAuthenticated = $derived(authState.status === 'authenticated');

export function isAuthenticated() {
	return _isAuthenticated;
}

export async function fetchMe() {
	authState.status = 'loading';
	try {
		const user = await getMe();
		authState.user = user;
		authState.status = 'authenticated';
		authState.error = null;
	} catch {
		authState.user = null;
		authState.status = 'unauthenticated';
	}
}

export async function login(input: LoginInput) {
	authState.status = 'loading';
	authState.error = null;
	try {
		const user = await apiLogin(input);
		authState.user = user;
		authState.status = 'authenticated';
	} catch (err) {
		authState.status = 'unauthenticated';
		authState.error = err instanceof ApiError ? err.message : 'Unknown error';
		throw err;
	}
}

export async function register(input: RegisterInput) {
	authState.status = 'loading';
	authState.error = null;
	try {
		const user = await apiRegister(input);
		authState.user = user;
		authState.status = 'authenticated';
	} catch (err) {
		authState.status = 'unauthenticated';
		authState.error = err instanceof ApiError ? err.message : 'Unknown error';
		throw err;
	}
}

export async function logout() {
	try {
		await apiLogout();
	} finally {
		authState.user = null;
		authState.status = 'unauthenticated';
	}
}

export async function updateProfile(input: PatchUserInput) {
	const user = await updateMe(input);
	authState.user = user;
}

export async function changePassword(input: ChangePasswordInput) {
	await apiChangePassword(input);
}
