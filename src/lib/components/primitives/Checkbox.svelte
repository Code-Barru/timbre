<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Check, Minus } from '@lucide/svelte';

	interface Props {
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}
	let {
		checked = $bindable(false),
		indeterminate = false,
		disabled = false,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	let on = $derived(checked || indeterminate);
</script>

<label
	class="inline-flex cursor-pointer items-center gap-2.5 {disabled
		? 'cursor-not-allowed text-text-faint'
		: 'text-text'} {className}"
>
	<input type="checkbox" bind:checked {indeterminate} {disabled} class="sr-only" {...rest} />
	<span
		class="flex h-5 w-5 flex-none items-center justify-center rounded-md border transition {on &&
		!disabled
			? 'border-primary bg-primary text-text-inverse'
			: 'border-border-strong bg-surface'} {disabled ? 'border-border bg-surface-sunken' : ''}"
	>
		{#if indeterminate}
			<Minus size={14} strokeWidth={3} />
		{:else if checked}
			<Check size={14} strokeWidth={3} />
		{/if}
	</span>
	{#if children}<span class="text-sm">{@render children()}</span>{/if}
</label>
