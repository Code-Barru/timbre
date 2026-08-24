export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export interface PositionOptions {
	anchor: HTMLElement | null;
	placement?: Placement;
	align?: Align;
	offset?: number;
	padding?: number;
}

function alignedStart(anchorStart: number, anchorSize: number, floatingSize: number, align: Align) {
	if (align === 'start') return anchorStart;
	if (align === 'end') return anchorStart + anchorSize - floatingSize;
	return anchorStart + anchorSize / 2 - floatingSize / 2;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function position(node: HTMLElement, options: PositionOptions) {
	let current = options;

	function update() {
		const anchor = current.anchor;
		if (!anchor) return;

		const offset = current.offset ?? 8;
		const padding = current.padding ?? 8;
		const align = current.align ?? 'center';
		const anchorRect = anchor.getBoundingClientRect();
		const floating = node.getBoundingClientRect();

		let placement = current.placement ?? 'bottom';

		if (placement === 'bottom' && anchorRect.bottom + offset + floating.height > window.innerHeight)
			placement = 'top';
		else if (placement === 'top' && anchorRect.top - offset - floating.height < 0)
			placement = 'bottom';
		else if (
			placement === 'right' &&
			anchorRect.right + offset + floating.width > window.innerWidth
		)
			placement = 'left';
		else if (placement === 'left' && anchorRect.left - offset - floating.width < 0)
			placement = 'right';

		let top: number;
		let left: number;

		if (placement === 'top' || placement === 'bottom') {
			top =
				placement === 'top'
					? anchorRect.top - floating.height - offset
					: anchorRect.bottom + offset;
			left = alignedStart(anchorRect.left, anchorRect.width, floating.width, align);
		} else {
			left =
				placement === 'left'
					? anchorRect.left - floating.width - offset
					: anchorRect.right + offset;
			top = alignedStart(anchorRect.top, anchorRect.height, floating.height, align);
		}

		node.style.position = 'fixed';
		node.style.top = `${clamp(top, padding, window.innerHeight - floating.height - padding)}px`;
		node.style.left = `${clamp(left, padding, window.innerWidth - floating.width - padding)}px`;
		node.dataset.placement = placement;
	}

	update();
	const frame = requestAnimationFrame(update);
	window.addEventListener('scroll', update, true);
	window.addEventListener('resize', update);

	return {
		update(next: PositionOptions) {
			current = next;
			update();
		},
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', update, true);
			window.removeEventListener('resize', update);
		}
	};
}
