<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Check from '@lucide/svelte/icons/check';
	import Minus from '@lucide/svelte/icons/minus';
	import { getFieldContext } from './field';

	type Size = 'sm' | 'md';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'checked'> {
		checked?: boolean;
		indeterminate?: boolean;
		size?: Size;
		children?: Snippet;
		class?: string;
	}

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
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

	const icons: Record<Size, string> = {
		sm: 'size-3',
		md: 'size-3.5'
	};

	const checkboxId = $derived(id ?? field?.id);
	const isOn = $derived(checked || indeterminate);
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
			type="checkbox"
			id={checkboxId}
			bind:checked
			bind:indeterminate
			{disabled}
			onchange={() => (indeterminate = false)}
			aria-describedby={field?.describedBy}
			class={[
				'appearance-none rounded-xs border border-line bg-surface-raised transition-colors duration-150 ease-out checked:border-brand-solid checked:bg-brand-solid indeterminate:border-brand-solid indeterminate:bg-brand-solid',
				boxes[size]
			]}
			{...rest}
		/>
		{#if isOn}
			<span class="pointer-events-none absolute inline-flex text-brand-on-solid">
				{#if indeterminate}
					<Minus class={icons[size]} aria-hidden="true" />
				{:else}
					<Check class={icons[size]} aria-hidden="true" />
				{/if}
			</span>
		{/if}
	</span>
	{#if children}
		<span class="text-fg">{@render children()}</span>
	{/if}
</label>
