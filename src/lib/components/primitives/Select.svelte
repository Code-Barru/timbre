<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';

	interface Props {
		value?: string;
		invalid?: boolean;
		disabled?: boolean;
		/** <option> elements. */
		children: Snippet;
		class?: string;
		[key: string]: unknown;
	}
	let {
		value = $bindable(''),
		invalid = false,
		disabled = false,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	let borderCls = $derived(invalid ? 'border-danger' : 'border-border-strong');
</script>

<div class="relative {className}">
	<select
		bind:value
		{disabled}
		class="w-full appearance-none rounded border bg-surface py-2.5 pr-10 pl-3 text-sm text-text transition focus:border-primary disabled:bg-surface-sunken disabled:text-text-faint disabled:cursor-not-allowed {borderCls}"
		{...rest}
	>
		{@render children()}
	</select>
	<ChevronDown
		size={16}
		class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted"
	/>
</div>
