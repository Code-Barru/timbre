<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { dismiss, position, type Align, type Placement } from '../internal';

	interface Props {
		open?: boolean;
		placement?: Placement;
		align?: Align;
		triggerClass?: string;
		triggerLabel?: string;
		trigger: Snippet;
		children: Snippet;
		class?: string;
	}

	let {
		open = $bindable(false),
		placement = 'bottom',
		align = 'start',
		triggerClass,
		triggerLabel,
		trigger,
		children,
		class: klass
	}: Props = $props();

	const id = $props.id();

	let anchor = $state<HTMLElement | null>(null);
	let menu = $state<HTMLElement | null>(null);
	let typed = '';
	let typedTimer: ReturnType<typeof setTimeout> | undefined;

	function items(): HTMLElement[] {
		if (!menu) return [];
		return [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(
			(item) => !item.hasAttribute('disabled')
		);
	}

	function focusItem(index: number) {
		const all = items();
		if (all.length === 0) return;
		const next = (index + all.length) % all.length;
		all[next].focus();
	}

	function currentIndex() {
		return items().indexOf(document.activeElement as HTMLElement);
	}

	function close(restoreFocus = true) {
		open = false;
		if (restoreFocus) anchor?.focus();
	}

	function onTriggerKeydown(event: KeyboardEvent) {
		if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		open = true;
	}

	function onMenuKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				focusItem(currentIndex() + 1);
				return;
			case 'ArrowUp':
				event.preventDefault();
				focusItem(currentIndex() - 1);
				return;
			case 'Home':
				event.preventDefault();
				focusItem(0);
				return;
			case 'End':
				event.preventDefault();
				focusItem(items().length - 1);
				return;
			case 'Tab':
				close(false);
				return;
		}

		if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
		clearTimeout(typedTimer);
		typed += event.key.toLowerCase();
		typedTimer = setTimeout(() => (typed = ''), 600);
		const match = items().findIndex((item) =>
			(item.textContent ?? '').trim().toLowerCase().startsWith(typed)
		);
		if (match >= 0) focusItem(match);
	}

	$effect(() => {
		if (open) focusItem(0);
	});

	$effect(() => () => clearTimeout(typedTimer));
</script>

<button
	bind:this={anchor}
	type="button"
	aria-expanded={open}
	aria-controls={open ? id : undefined}
	aria-haspopup="menu"
	aria-label={triggerLabel}
	onclick={() => (open = !open)}
	onkeydown={onTriggerKeydown}
	class={triggerClass}
>
	{@render trigger()}
</button>

{#if open}
	<div
		{id}
		bind:this={menu}
		role="menu"
		tabindex="-1"
		transition:fade={{ duration: 100 }}
		onkeydown={onMenuKeydown}
		onclick={() => close()}
		use:position={{ anchor, placement, align, offset: 6 }}
		use:dismiss={{ ondismiss: close, anchor }}
		class={[
			'z-50 min-w-44 rounded-lg border border-line-subtle bg-surface-overlay p-1 shadow-overlay outline-none',
			klass
		]}
	>
		{@render children()}
	</div>
{/if}
