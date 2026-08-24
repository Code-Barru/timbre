<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import X from '@lucide/svelte/icons/x';
	import { getFieldContext } from './field';

	type Size = 'sm' | 'md' | 'lg';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'value' | 'prefix'> {
		value?: string | number;
		size?: Size;
		invalid?: boolean;
		clearable?: boolean;
		clearLabel?: string;
		prefix?: Snippet;
		suffix?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(''),
		size = 'md',
		invalid = false,
		clearable = false,
		clearLabel = 'Clear',
		disabled = false,
		readonly = false,
		type = 'text',
		id,
		prefix,
		suffix,
		class: klass,
		...rest
	}: Props = $props();

	const field = getFieldContext();

	const sizes: Record<Size, string> = {
		sm: 'h-8 gap-2 px-2.5 text-sm',
		md: 'h-9.5 gap-2 px-3 text-sm',
		lg: 'h-11 gap-2.5 px-3.5 text-base'
	};

	const inputId = $derived(id ?? field?.id);
	const isInvalid = $derived(invalid || field?.invalid || false);
	const showClear = $derived(clearable && !disabled && !readonly && String(value).length > 0);
</script>

<div
	class={[
		'flex w-full items-center rounded-md border bg-surface-raised text-fg transition-colors duration-150 ease-out',
		isInvalid ? 'border-danger-solid' : 'border-line focus-within:border-brand-solid',
		'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
		disabled && 'pointer-events-none opacity-50',
		readonly && 'bg-surface-sunken',
		sizes[size],
		klass
	]}
>
	{#if prefix}
		<span class="flex shrink-0 items-center text-fg-muted">{@render prefix()}</span>
	{/if}
	<input
		{type}
		id={inputId}
		bind:value
		{disabled}
		{readonly}
		aria-invalid={isInvalid || undefined}
		aria-describedby={field?.describedBy}
		required={field?.required}
		class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-muted"
		{...rest}
	/>
	{#if showClear}
		<button
			type="button"
			aria-label={clearLabel}
			onclick={() => (value = '')}
			class="shrink-0 rounded-xs text-fg-muted transition-colors duration-150 ease-out hover:text-fg"
		>
			<X class="size-4" aria-hidden="true" />
		</button>
	{/if}
	{#if suffix}
		<span class="flex shrink-0 items-center text-fg-muted">{@render suffix()}</span>
	{/if}
</div>
