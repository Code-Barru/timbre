export type ToastTone = 'brand' | 'danger' | 'warning' | 'success';

export interface Toast {
	id: string;
	title: string;
	description?: string;
	tone: ToastTone;
	duration: number;
}

export interface ToastOptions {
	title: string;
	description?: string;
	tone?: ToastTone;
	duration?: number;
}

class ToastStore {
	#items = $state<Toast[]>([]);
	#timers = new Map<string, ReturnType<typeof setTimeout>>();

	get items(): Toast[] {
		return this.#items;
	}

	push(options: ToastOptions): string {
		const toast: Toast = {
			id: crypto.randomUUID(),
			title: options.title,
			description: options.description,
			tone: options.tone ?? 'brand',
			duration: options.duration ?? 5000
		};
		this.#items.push(toast);
		this.resume(toast.id);
		return toast.id;
	}

	dismiss(id: string) {
		this.pause(id);
		this.#items = this.#items.filter((toast) => toast.id !== id);
	}

	pause(id: string) {
		const timer = this.#timers.get(id);
		if (timer === undefined) return;
		clearTimeout(timer);
		this.#timers.delete(id);
	}

	resume(id: string) {
		const toast = this.#items.find((item) => item.id === id);
		if (!toast || toast.duration <= 0 || this.#timers.has(id)) return;
		this.#timers.set(
			id,
			setTimeout(() => this.dismiss(id), toast.duration)
		);
	}

	clear() {
		for (const timer of this.#timers.values()) clearTimeout(timer);
		this.#timers.clear();
		this.#items = [];
	}
}

export const toasts = new ToastStore();
