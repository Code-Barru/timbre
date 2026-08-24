<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getFieldContext } from './field';

	type Size = 'sm' | 'md';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'group'> {
		group?: string | number | null;
		value: string | number;
		size?: Size;
		children?: Snippet;
		class?: string;
	}

	let {
		group = $bindable(null),
		value,
		size = 'md',
		disabled = false,
		id,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const field = getFieldContext();

	const boxes: Record<Size, string> = {
		sm: 'size-4',
		md: 'size-4.5'
	};

	const dots: Record<Size, string> = {
		sm: 'size-1.5',
		md: 'size-2'
	};

	const radioId = $derived(id ?? `${field?.id ?? ''}-${value}`);
</script>

<label
	class={[
		'inline-flex items-center gap-2 text-sm',
		disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
		klass
	]}
>
	<span class="relative inline-flex shrink-0 items-center justify-center">
		<input
			type="radio"
			id={radioId}
			{value}
			bind:group
			{disabled}
			aria-describedby={field?.describedBy}
			class={[
				'appearance-none rounded-full border border-line bg-surface-raised transition-colors duration-150 ease-out checked:border-brand-solid',
				boxes[size]
			]}
			{...rest}
		/>
		{#if group === value}
			<span
				class={['pointer-events-none absolute rounded-full bg-brand-solid', dots[size]]}
				aria-hidden="true"
			></span>
		{/if}
	</span>
	{#if children}
		<span class="text-fg">{@render children()}</span>
	{/if}
</label>
