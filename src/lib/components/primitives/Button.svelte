<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ResolvedPathname } from '$app/types';
	import Spinner from './Spinner.svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		loading?: boolean;
		disabled?: boolean;
		/** Render as an anchor instead of a button. Already resolved by the caller. */
		href?: ResolvedPathname;
		type?: 'button' | 'submit' | 'reset';
		block?: boolean;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	}
	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		href,
		type = 'button',
		block = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active',
		secondary:
			'bg-surface text-text border border-border-strong hover:bg-surface-sunken active:bg-chip',
		ghost: 'bg-transparent text-primary hover:bg-primary-subtle active:bg-primary-subtle',
		destructive: 'bg-danger text-text-inverse hover:brightness-90 active:brightness-95'
	};
	const sizes: Record<Size, string> = {
		sm: 'text-[13px] px-3 py-1.5 gap-1.5',
		md: 'text-sm px-4 py-2.5 gap-2',
		lg: 'text-base px-5 py-3 gap-2'
	};
	const base =
		'inline-flex items-center justify-center active:scale-[0.99] transition-all transition-200 rounded font-semibold whitespace-nowrap transition select-none disabled:cursor-not-allowed disabled:opacity-45';

	let cls = $derived(
		`${base} ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`
	);
	let isDisabled = $derived(disabled || loading);
</script>

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is typed ResolvedPathname -->
	<a {href} class={cls} aria-disabled={isDisabled} tabindex={isDisabled ? -1 : undefined} {...rest}>
		{#if loading}<Spinner size="xs" tone="current" />{/if}
		{@render children()}
	</a>
{:else}
	<button {type} class={cls} disabled={isDisabled} {...rest}>
		{#if loading}<Spinner size="xs" tone="current" />{/if}
		{@render children()}
	</button>
{/if}
