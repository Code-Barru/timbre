<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Loader from '../feedback/Loader.svelte';

	type Variant = 'solid' | 'soft' | 'outline' | 'ghost';
	type Tone = 'brand' | 'neutral' | 'danger' | 'warning' | 'success';
	type Size = 'xs' | 'sm' | 'md' | 'lg';

	interface Props extends HTMLButtonAttributes {
		label: string;
		variant?: Variant;
		tone?: Tone;
		size?: Size;
		loading?: boolean;
		round?: boolean;
		children?: Snippet;
		class?: string;
	}

	let {
		label,
		variant = 'ghost',
		tone = 'neutral',
		size = 'md',
		loading = false,
		round = false,
		disabled = false,
		type = 'button',
		children,
		class: klass,
		...rest
	}: Props = $props();

	const base =
		'relative inline-flex shrink-0 items-center justify-center transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50';

	const variants: Record<Variant, Record<Tone, string>> = {
		solid: {
			brand: 'bg-brand-solid text-brand-on-solid hover:bg-brand-solid-hover',
			neutral: 'bg-neutral-solid text-neutral-on-solid hover:bg-neutral-solid-hover',
			danger: 'bg-danger-solid text-danger-on-solid hover:bg-danger-solid-hover',
			warning: 'bg-warning-solid text-warning-on-solid hover:bg-warning-solid-hover',
			success: 'bg-success-solid text-success-on-solid hover:bg-success-solid-hover'
		},
		soft: {
			brand: 'bg-brand-subtle text-brand-fg hover:bg-brand-subtle-hover',
			neutral: 'bg-neutral-subtle text-neutral-fg hover:bg-neutral-subtle-hover',
			danger: 'bg-danger-subtle text-danger-fg hover:bg-danger-subtle-hover',
			warning: 'bg-warning-subtle text-warning-fg hover:bg-warning-subtle-hover',
			success: 'bg-success-subtle text-success-fg hover:bg-success-subtle-hover'
		},
		outline: {
			brand: 'border border-brand-line text-brand-fg hover:bg-brand-subtle',
			neutral: 'border border-line text-fg-secondary hover:bg-neutral-subtle',
			danger: 'border border-danger-line text-danger-fg hover:bg-danger-subtle',
			warning: 'border border-warning-line text-warning-fg hover:bg-warning-subtle',
			success: 'border border-success-line text-success-fg hover:bg-success-subtle'
		},
		ghost: {
			brand: 'text-brand-fg hover:bg-brand-subtle',
			neutral: 'text-fg-secondary hover:bg-neutral-subtle',
			danger: 'text-danger-fg hover:bg-danger-subtle',
			warning: 'text-warning-fg hover:bg-warning-subtle',
			success: 'text-success-fg hover:bg-success-subtle'
		}
	};

	const sizes: Record<Size, string> = {
		xs: 'size-7 rounded-sm',
		sm: 'size-8 rounded-md',
		md: 'size-9.5 rounded-md',
		lg: 'size-11 rounded-md'
	};

	const loaderSizes: Record<Size, 'xs' | 'sm' | 'md' | 'lg'> = {
		xs: 'xs',
		sm: 'xs',
		md: 'sm',
		lg: 'md'
	};
</script>

<button
	{type}
	aria-label={label}
	disabled={disabled || loading}
	aria-busy={loading || undefined}
	class={[base, variants[variant][tone], sizes[size], round && 'rounded-full', klass]}
	{...rest}
>
	{#if loading}
		<Loader size={loaderSizes[size]} {label} />
	{:else}
		{@render children?.()}
	{/if}
</button>
