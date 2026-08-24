<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getFieldContext } from './field';

	type Size = 'sm' | 'md';

	interface Props {
		checked?: boolean;
		size?: Size;
		disabled?: boolean;
		label?: string;
		id?: string;
		children?: Snippet;
		class?: string;
	}

	let {
		checked = $bindable(false),
		size = 'md',
		disabled = false,
		label,
		id,
		children,
		class: klass
	}: Props = $props();

	const field = getFieldContext();

	const tracks: Record<Size, string> = {
		sm: 'h-4.5 w-8',
		md: 'h-5.5 w-9.5'
	};

	const thumbs: Record<Size, string> = {
		sm: 'size-3.5',
		md: 'size-4.5'
	};

	const offsets: Record<Size, string> = {
		sm: 'translate-x-3.5',
		md: 'translate-x-4'
	};

	const switchId = $derived(id ?? field?.id);
</script>

<div class={['inline-flex items-center gap-2', klass]}>
	<button
		type="button"
		role="switch"
		id={switchId}
		aria-checked={checked}
		aria-label={label}
		aria-describedby={field?.describedBy}
		{disabled}
		onclick={() => (checked = !checked)}
		class={[
			'inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5 transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50',
			checked ? 'bg-brand-solid' : 'bg-line',
			tracks[size]
		]}
	>
		<span
			class={[
				'rounded-full bg-surface-raised transition-transform duration-150 ease-out motion-reduce:transition-none',
				thumbs[size],
				checked ? offsets[size] : 'translate-x-0'
			]}
		></span>
	</button>
	{#if children}
		<span class="text-sm text-fg">{@render children()}</span>
	{/if}
</div>
