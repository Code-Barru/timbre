<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import Loader from '../feedback/Loader.svelte';

	type Variant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';
	type Tone = 'brand' | 'neutral' | 'danger' | 'warning' | 'success';
	type Size = 'xs' | 'sm' | 'md' | 'lg';

	interface Props
		extends HTMLButtonAttributes, Pick<HTMLAnchorAttributes, 'href' | 'target' | 'rel'> {
		variant?: Variant;
		tone?: Tone;
		size?: Size;
		loading?: boolean;
		loadingLabel?: string;
		fullWidth?: boolean;
		icon?: Snippet;
		iconEnd?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		variant = 'solid',
		tone = 'brand',
		size = 'md',
		loading = false,
		loadingLabel = 'Loading',
		fullWidth = false,
		disabled = false,
		type = 'button',
		href,
		target,
		rel,
		icon,
		iconEnd,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const base =
		'relative inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors transition-transform active:scale-95 duration-150 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50';

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
		},
		link: {
			brand: 'text-brand-fg underline underline-offset-4 hover:decoration-2',
			neutral: 'text-fg underline underline-offset-4 hover:decoration-2',
			danger: 'text-danger-fg underline underline-offset-4 hover:decoration-2',
			warning: 'text-warning-fg underline underline-offset-4 hover:decoration-2',
			success: 'text-success-fg underline underline-offset-4 hover:decoration-2'
		}
	};

	const sizes: Record<Size, string> = {
		xs: 'h-7 rounded-sm px-2 text-xs',
		sm: 'h-8 rounded-md px-2.5 text-sm',
		md: 'h-9.5 rounded-md px-3.5 text-sm',
		lg: 'h-11 rounded-md px-5 text-base'
	};

	const linkSizes: Record<Size, string> = {
		xs: 'text-xs',
		sm: 'text-sm',
		md: 'text-sm',
		lg: 'text-base'
	};

	const gaps: Record<Size, string> = {
		xs: 'gap-1',
		sm: 'gap-1.5',
		md: 'gap-2',
		lg: 'gap-2'
	};

	const loaderSizes: Record<Size, 'xs' | 'sm' | 'md' | 'lg'> = {
		xs: 'xs',
		sm: 'xs',
		md: 'sm',
		lg: 'md'
	};

	const classes = $derived([
		base,
		variants[variant][tone],
		variant === 'link' ? linkSizes[size] : sizes[size],
		fullWidth && 'w-full',
		klass
	]);
</script>

{#snippet content()}
	{#if loading}
		<span class="absolute inset-0 flex items-center justify-center">
			<Loader size={loaderSizes[size]} label={loadingLabel} />
		</span>
	{/if}
	<span class={['inline-flex items-center', gaps[size], loading && 'invisible']}>
		{@render icon?.()}
		{@render children?.()}
		{@render iconEnd?.()}
	</span>
{/snippet}

{#if href}
	<a
		{href}
		{target}
		{rel}
		class={classes}
		aria-disabled={disabled || loading || undefined}
		aria-busy={loading || undefined}
		tabindex={disabled ? -1 : undefined}
		{...rest as HTMLAnchorAttributes}
	>
		{@render content()}
	</a>
{:else}
	<button
		{type}
		disabled={disabled || loading}
		class={classes}
		aria-busy={loading || undefined}
		{...rest}
	>
		{@render content()}
	</button>
{/if}
