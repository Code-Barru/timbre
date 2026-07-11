<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Shared bindable group value. */
		group?: string;
		/** This option's value. */
		value: string;
		disabled?: boolean;
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}
	let {
		group = $bindable(''),
		value,
		disabled = false,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	let selected = $derived(group === value);
</script>

<label
	class="inline-flex cursor-pointer items-center gap-2.5 {disabled
		? 'cursor-not-allowed text-text-faint'
		: 'text-text'} {className}"
>
	<input type="radio" bind:group {value} {disabled} class="sr-only" {...rest} />
	<span
		class="flex h-5 w-5 flex-none items-center justify-center rounded-full border transition {selected &&
		!disabled
			? 'border-primary'
			: 'border-border-strong'} {disabled ? 'border-border bg-surface-sunken' : 'bg-surface'}"
	>
		{#if selected}
			<span class="h-2.5 w-2.5 rounded-full {disabled ? 'bg-text-faint' : 'bg-primary'}"></span>
		{/if}
	</span>
	{#if children}<span class="text-sm">{@render children()}</span>{/if}
</label>
