export interface DismissOptions {
	ondismiss: () => void;
	anchor?: HTMLElement | null;
	enabled?: boolean;
	escape?: boolean;
	outside?: boolean;
}

export function dismiss(node: HTMLElement, options: DismissOptions) {
	let current = options;

	function onPointerDown(event: PointerEvent) {
		if (current.enabled === false || current.outside === false) return;
		const target = event.target as Node | null;
		if (!target) return;
		if (node.contains(target)) return;
		if (current.anchor?.contains(target)) return;
		current.ondismiss();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (current.enabled === false || current.escape === false) return;
		if (event.key !== 'Escape') return;
		event.stopPropagation();
		current.ondismiss();
	}

	document.addEventListener('pointerdown', onPointerDown, true);
	document.addEventListener('keydown', onKeyDown, true);

	return {
		update(next: DismissOptions) {
			current = next;
		},
		destroy() {
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('keydown', onKeyDown, true);
		}
	};
}
