<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { getFieldContext } from './field';

	type Size = 'sm' | 'md' | 'lg';

	interface Props extends Omit<HTMLSelectAttributes, 'size'> {
		value?: string | number | null;
		size?: Size;
		invalid?: boolean;
		placeholder?: string;
		children?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(null),
		size = 'md',
		invalid = false,
		placeholder,
		disabled = false,
		id,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const field = getFieldContext();

	const sizes: Record<Size, string> = {
		sm: 'h-8 pl-2.5 pr-8 text-sm',
		md: 'h-9.5 pl-3 pr-9 text-sm',
		lg: 'h-11 pl-3.5 pr-10 text-base'
	};

	const selectId = $derived(id ?? field?.id);
	const isInvalid = $derived(invalid || field?.invalid || false);
</script>

<div class={['relative inline-flex w-full items-center', klass]}>
	<select
		id={selectId}
		bind:value
		{disabled}
		aria-invalid={isInvalid || undefined}
		aria-describedby={field?.describedBy}
		required={field?.required}
		class={[
			'w-full appearance-none rounded-md border bg-surface-raised text-fg transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50',
			isInvalid ? 'border-danger-solid' : 'border-line focus:border-brand-solid',
			sizes[size]
		]}
		{...rest}
	>
		{#if placeholder}
			<option value={null} disabled>{placeholder}</option>
		{/if}
		{@render children?.()}
	</select>
	<ChevronDown
		class="pointer-events-none absolute right-3 size-4 text-fg-muted"
		aria-hidden="true"
	/>
</div>
