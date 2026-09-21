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
			brand:
				'bg-brand-solid text-brand-on-solid hover:bg-brand-solid-hover active:bg-brand-solid-active',
			neutral:
				'bg-neutral-solid text-neutral-on-solid hover:bg-neutral-solid-hover active:bg-neutral-solid-active',
			danger:
				'bg-danger-solid text-danger-on-solid hover:bg-danger-solid-hover active:bg-danger-solid-active',
			warning:
				'bg-warning-solid text-warning-on-solid hover:bg-warning-solid-hover active:bg-warning-solid-active',
			success:
				'bg-success-solid text-success-on-solid hover:bg-success-solid-hover active:bg-success-solid-active'
		},
		soft: {
			brand:
				'bg-brand-subtle text-brand-fg hover:bg-brand-subtle-hover active:bg-brand-subtle-active',
			neutral:
				'bg-neutral-subtle text-neutral-fg hover:bg-neutral-subtle-hover active:bg-neutral-subtle-active',
			danger:
				'bg-danger-subtle text-danger-fg hover:bg-danger-subtle-hover active:bg-danger-subtle-active',
			warning:
				'bg-warning-subtle text-warning-fg hover:bg-warning-subtle-hover active:bg-warning-subtle-active',
			success:
				'bg-success-subtle text-success-fg hover:bg-success-subtle-hover active:bg-success-subtle-active'
		},
		outline: {
			brand:
				'border border-brand-line text-brand-fg hover:bg-brand-subtle active:bg-brand-subtle-hover',
			neutral:
				'border border-line text-fg-secondary hover:bg-neutral-subtle active:bg-neutral-subtle-hover',
			danger:
				'border border-danger-line text-danger-fg hover:bg-danger-subtle active:bg-danger-subtle-hover',
			warning:
				'border border-warning-line text-warning-fg hover:bg-warning-subtle active:bg-warning-subtle-hover',
			success:
				'border border-success-line text-success-fg hover:bg-success-subtle active:bg-success-subtle-hover'
		},
		ghost: {
			brand: 'text-brand-fg hover:bg-brand-subtle active:bg-brand-subtle-hover',
			neutral: 'text-fg-secondary hover:bg-neutral-subtle active:bg-neutral-subtle-hover',
			danger: 'text-danger-fg hover:bg-danger-subtle active:bg-danger-subtle-hover',
			warning: 'text-warning-fg hover:bg-warning-subtle active:bg-warning-subtle-hover',
			success: 'text-success-fg hover:bg-success-subtle active:bg-success-subtle-hover'
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
