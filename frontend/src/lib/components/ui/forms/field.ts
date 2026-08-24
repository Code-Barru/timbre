import { getContext, setContext } from 'svelte';

export interface FieldContext {
	readonly id: string;
	readonly describedBy: string | undefined;
	readonly invalid: boolean;
	readonly required: boolean;
}

const FIELD_KEY = Symbol('timbre.field');

export function setFieldContext(context: FieldContext) {
	setContext(FIELD_KEY, context);
}

export function getFieldContext(): FieldContext | undefined {
	return getContext<FieldContext | undefined>(FIELD_KEY);
}
