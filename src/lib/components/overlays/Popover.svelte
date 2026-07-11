<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';

	type Placement = 'bottom' | 'top';

	interface Props {
		open?: boolean;
		placement?: Placement;
		trigger: Snippet;
		children: Snippet;
		class?: string;
	}
	let {
		open = $bindable(false),
		placement = 'bottom',
		trigger,
		children,
		class: className = ''
	}: Props = $props();

	let root = $state<HTMLDivElement | null>(null);

	function toggle() {
		open = !open;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	// Close on outside click.
	$effect(() => {
		if (!open) return;
		function onWindowClick(e: MouseEvent) {
			if (root && !root.contains(e.target as Node)) open = false;
		}
		// Defer so the opening click doesn't immediately close it.
		window.addEventListener('click', onWindowClick);
		return () => window.removeEventListener('click', onWindowClick);
	});

	let posCls = $derived(
		placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
	);
</script>

<svelte:window on:keydown={open ? onkeydown : undefined} />

<div bind:this={root} class="relative inline-block">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div onclick={toggle} role="button" tabindex="-1">
		{@render trigger()}
	</div>

	{#if open}
		<div
			class="absolute left-0 {posCls} min-w-[220px] rounded-lg border border-border bg-surface p-3 shadow-xl {className}"
			role="dialog"
			transition:scale={{ duration: 140, start: 0.96, opacity: 0 }}
		>
			{@render children()}
		</div>
	{/if}
</div>
