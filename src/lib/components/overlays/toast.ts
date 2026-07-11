import { writable } from 'svelte/store';

export type ToastVariant = 'success' | 'danger' | 'info' | 'message';

export interface ToastAction {
	label: string;
	onclick: () => void;
}

export interface Toast {
	id: number;
	variant: ToastVariant;
	message: string;
	action?: ToastAction;
	duration?: number;
}

export interface ToastOptions {
	action?: ToastAction;
	/** Auto-dismiss delay in ms. `0` keeps the toast until dismissed manually. */
	duration?: number;
}

const DEFAULT_DURATION = 4000;

export const toasts = writable<Toast[]>([]);

let counter = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function dismiss(id: number) {
	const timer = timers.get(id);
	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}
	toasts.update((list) => list.filter((t) => t.id !== id));
}

function push(variant: ToastVariant, message: string, opts: ToastOptions = {}): number {
	const id = ++counter;
	const duration = opts.duration ?? DEFAULT_DURATION;
	const item: Toast = { id, variant, message, action: opts.action, duration };

	toasts.update((list) => [...list, item]);

	if (duration > 0) {
		timers.set(
			id,
			setTimeout(() => dismiss(id), duration)
		);
	}
	return id;
}

export const toast = {
	success: (message: string, opts?: ToastOptions) => push('success', message, opts),
	danger: (message: string, opts?: ToastOptions) => push('danger', message, opts),
	info: (message: string, opts?: ToastOptions) => push('info', message, opts),
	message: (message: string, opts?: ToastOptions) => push('message', message, opts),
	dismiss
};
