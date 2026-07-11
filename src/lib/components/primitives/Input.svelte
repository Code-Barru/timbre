<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		value?: string;
		type?: string;
		placeholder?: string;
		invalid?: boolean;
		disabled?: boolean;
		/** Icon rendered inside the field, leading edge. */
		leading?: Snippet;
		/** Control rendered inside the field, trailing edge (e.g. a clear button). */
		trailing?: Snippet;
		class?: string;
		[key: string]: unknown;
	}
	let {
		value = $bindable(''),
		type = 'text',
		placeholder,
		invalid = false,
		disabled = false,
		leading,
		trailing,
		class: className = '',
		...rest
	}: Props = $props();

	const base =
		'flex w-full items-center gap-2 rounded border bg-surface px-3 py-2.5 text-sm text-text transition focus-within:border-primary';
	let borderCls = $derived(
		invalid
			? 'border-danger focus-within:border-danger focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-danger)_35%,transparent)]'
			: 'border-border-strong'
	);
	let disabledCls = $derived(disabled ? 'bg-surface-sunken text-text-faint' : '');
</script>

<div class="{base} {borderCls} {disabledCls} {className}">
	{#if leading}<span class="flex-none text-text-faint">{@render leading()}</span>{/if}
	<input
		{type}
		{placeholder}
		{disabled}
		bind:value
		class="w-full flex-1 border-none bg-transparent p-0 text-text placeholder:text-text-faint focus:outline-none focus:shadow-none disabled:cursor-not-allowed"
		{...rest}
	/>
	{#if trailing}<span class="flex-none">{@render trailing()}</span>{/if}
</div>
