import { z } from 'zod';
import { errorEnvelopeSchema, successEnvelope } from './envelope';
import { ApiError } from './errors';
import { notifyUnauthorized } from './unauthorized';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function apiRequest<T>(opts: {
	method: Method;
	path: string;
	body?: unknown;
	responseSchema: z.ZodType<T>;
}): Promise<T> {
	let res: Response;
	try {
		res = await fetch(opts.path, {
			method: opts.method,
			headers: opts.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
			body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
		});
	} catch {
		throw new ApiError('Network error', 0);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	let json: unknown;
	try {
		json = await res.json();
	} catch {
		throw new ApiError('Response body was not valid JSON', res.status);
	}

	if (!res.ok) {
		if (res.status === 401 && !opts.path.startsWith('/api/auth/')) {
			notifyUnauthorized();
		}
		const parsed = errorEnvelopeSchema.safeParse(json);
		if (!parsed.success) {
			throw new ApiError('Error response did not match expected schema', res.status);
		}
		throw new ApiError(parsed.data.error.message, res.status, parsed.data.error.data);
	}

	const parsed = successEnvelope(opts.responseSchema).safeParse(json);
	if (!parsed.success) {
		throw new ApiError('Success response did not match expected schema', res.status);
	}
	return parsed.data.data;
}
