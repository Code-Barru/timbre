<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { position, type Placement } from '../internal';

	interface Props {
		text: string;
		placement?: Placement;
		delay?: number;
		closeDelay?: number;
		children: Snippet;
		class?: string;
	}

	let {
		text,
		placement = 'top',
		delay = 400,
		closeDelay = 100,
		children,
		class: klass
	}: Props = $props();

	const id = $props.id();

	let anchor = $state<HTMLElement | null>(null);
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function schedule(next: boolean, wait: number) {
		clearTimeout(timer);
		timer = setTimeout(() => (open = next), wait);
	}

	function show() {
		schedule(true, delay);
	}

	function hide() {
		schedule(false, closeDelay);
	}

	function showNow() {
		clearTimeout(timer);
		open = true;
	}

	function hideNow() {
		clearTimeout(timer);
		open = false;
	}

	$effect(() => {
		const target = anchor?.firstElementChild;
		if (!target) return;
		if (open) target.setAttribute('aria-describedby', id);
		else target.removeAttribute('aria-describedby');
	});

	$effect(() => () => clearTimeout(timer));
</script>

<span
	bind:this={anchor}
	class="contents"
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={showNow}
	onfocusout={hideNow}
	role="presentation"
>
	{@render children()}
</span>

{#if open}
	<div
		{id}
		role="tooltip"
		transition:fade={{ duration: 100 }}
		use:position={{ anchor, placement, offset: 8 }}
		class={[
			'pointer-events-none z-50 max-w-64 rounded-md bg-neutral-solid px-2 py-1 text-xs font-medium text-neutral-on-solid shadow-popover',
			klass
		]}
	>
		{text}
	</div>
{/if}
