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
	let panel = $state<HTMLElement | null>(null);

	function close() {
		open = false;
		anchor?.focus();
	}

	$effect(() => {
		if (!open || !panel) return;
		const focusable = panel.querySelector<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		(focusable ?? panel).focus();
	});
</script>

<button
	bind:this={anchor}
	type="button"
	aria-expanded={open}
	aria-controls={open ? id : undefined}
	aria-haspopup="dialog"
	aria-label={triggerLabel}
	onclick={() => (open = !open)}
	class={triggerClass}
>
	{@render trigger()}
</button>

{#if open}
	<div
		{id}
		bind:this={panel}
		tabindex="-1"
		transition:fade={{ duration: 120 }}
		use:position={{ anchor, placement, align, offset: 8 }}
		use:dismiss={{ ondismiss: close, anchor }}
		class={[
			'z-50 rounded-lg border border-line-subtle bg-surface-overlay p-3 shadow-overlay outline-none',
			klass
		]}
	>
		{@render children()}
	</div>
{/if}
