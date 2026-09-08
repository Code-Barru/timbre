import { z } from 'zod';

export class ApiError extends Error {
	status: number;
	fieldErrors?: Record<string, string[]>;

	constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.fieldErrors = fieldErrors;
	}
}

export function validationError(error: z.ZodError<Record<string, unknown>>): ApiError {
	const flat = z.flattenError(error);
	const fieldErrors: Record<string, string[]> = {};
	for (const [field, messages] of Object.entries(flat.fieldErrors)) {
		if (messages?.length) fieldErrors[field] = messages;
	}
	const message = flat.formErrors[0] ?? Object.values(fieldErrors)[0]?.[0] ?? 'Invalid input';
	return new ApiError(message, 422, fieldErrors);
}
