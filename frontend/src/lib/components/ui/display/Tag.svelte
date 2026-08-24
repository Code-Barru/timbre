<script lang="ts">
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';

	type Tone = 'brand' | 'neutral' | 'danger' | 'warning' | 'success';
	type Size = 'sm' | 'md';
	type Type = 'static' | 'removable' | 'toggle' | 'count';

	interface Props {
		type?: Type;
		tone?: Tone;
		size?: Size;
		pressed?: boolean;
		count?: number;
		disabled?: boolean;
		removeLabel?: string;
		onremove?: () => void;
		children?: Snippet;
		class?: string;
	}

	let {
		type = 'static',
		tone = 'neutral',
		size = 'md',
		pressed = $bindable(false),
		count,
		disabled = false,
		removeLabel = 'Remove',
		onremove,
		children,
		class: klass
	}: Props = $props();

	const base =
		'inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap transition-colors duration-150 ease-out';

	const tones: Record<Tone, string> = {
		brand: 'border-brand-line bg-brand-subtle text-brand-fg',
		neutral: 'border-line-subtle bg-neutral-subtle text-neutral-fg',
		danger: 'border-danger-line bg-danger-subtle text-danger-fg',
		warning: 'border-warning-line bg-warning-subtle text-warning-fg',
		success: 'border-success-line bg-success-subtle text-success-fg'
	};

	const pressedTones: Record<Tone, string> = {
		brand: 'border-brand-solid bg-brand-solid text-brand-on-solid',
		neutral: 'border-neutral-solid bg-neutral-solid text-neutral-on-solid',
		danger: 'border-danger-solid bg-danger-solid text-danger-on-solid',
		warning: 'border-warning-solid bg-warning-solid text-warning-on-solid',
		success: 'border-success-solid bg-success-solid text-success-on-solid'
	};

	const idleTones: Record<Tone, string> = {
		brand: 'border-line-subtle bg-transparent text-fg-secondary hover:bg-brand-subtle',
		neutral: 'border-line-subtle bg-transparent text-fg-secondary hover:bg-neutral-subtle',
		danger: 'border-line-subtle bg-transparent text-fg-secondary hover:bg-danger-subtle',
		warning: 'border-line-subtle bg-transparent text-fg-secondary hover:bg-warning-subtle',
		success: 'border-line-subtle bg-transparent text-fg-secondary hover:bg-success-subtle'
	};

	const sizes: Record<Size, string> = {
		sm: 'h-6 px-2 text-xs',
		md: 'h-7 px-2.5 text-sm'
	};

	const iconSizes: Record<Size, string> = {
		sm: 'size-3',
		md: 'size-3.5'
	};
</script>

{#if type === 'toggle'}
	<button
		type="button"
		{disabled}
		aria-pressed={pressed}
		onclick={() => (pressed = !pressed)}
		class={[
			base,
			sizes[size],
			pressed ? pressedTones[tone] : idleTones[tone],
			'disabled:pointer-events-none disabled:opacity-50',
			klass
		]}
	>
		{@render children?.()}
	</button>
{:else}
	<span class={[base, sizes[size], tones[tone], klass]}>
		{@render children?.()}
		{#if type === 'count'}
			<span class="rounded-sm bg-current/15 px-1 tabular-nums">{count}</span>
		{/if}
		{#if type === 'removable'}
			<button
				type="button"
				{disabled}
				aria-label={removeLabel}
				onclick={onremove}
				class="-mr-1 inline-flex items-center rounded-xs p-0.5 opacity-70 transition-opacity duration-150 ease-out hover:opacity-100 disabled:pointer-events-none disabled:opacity-40"
			>
				<X class={iconSizes[size]} aria-hidden="true" />
			</button>
		{/if}
	</span>
{/if}
