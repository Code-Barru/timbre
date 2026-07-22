<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Placement = 'top' | 'bottom' | 'left' | 'right';

	interface Props {
		label: string;
		placement?: Placement;
		children: Snippet;
		class?: string;
	}
	let { label, placement = 'top', children, class: className = '' }: Props = $props();

	let visible = $state(false);

	const panelPos: Record<Placement, string> = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};
	const caretPos: Record<Placement, string> = {
		top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
		bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
		left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
		right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="relative inline-flex {className}"
	onmouseenter={() => (visible = true)}
	onmouseleave={() => (visible = false)}
	onfocusin={() => (visible = true)}
	onfocusout={() => (visible = false)}
>
	{@render children()}

	{#if visible}
		<span
			role="tooltip"
			class="pointer-events-none absolute {panelPos[
				placement
			]} z-10 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
			transition:fade={{ duration: 100 }}
		>
			{label}
			<span class="absolute {caretPos[placement]} h-2 w-2 rotate-45 bg-neutral-900"></span>
		</span>
	{/if}
</span>
