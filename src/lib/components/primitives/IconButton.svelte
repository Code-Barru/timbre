<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		/** Required for accessibility — sets aria-label + title. */
		label: string;
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		href?: string;
		class?: string;
		children: Snippet;
		[key: string]: unknown;
	}
	let {
		label,
		variant = 'secondary',
		size = 'md',
		disabled = false,
		href,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-text-inverse hover:bg-primary-hover',
		secondary: 'bg-surface text-text border border-border-strong hover:bg-surface-sunken',
		ghost: 'bg-transparent text-text-muted hover:bg-primary-subtle hover:text-primary',
		danger: 'bg-danger-subtle text-danger hover:brightness-95'
	};
	const sizes: Record<Size, string> = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-11 w-11' };
	const base =
		'inline-flex flex-none items-center justify-center rounded transition select-none disabled:cursor-not-allowed disabled:opacity-45';

	let cls = $derived(`${base} ${sizes[size]} ${variants[variant]} ${className}`);
</script>

{#if href}
	<a {href} class={cls} aria-label={label} title={label} {...rest}>{@render children()}</a>
{:else}
	<button type="button" class={cls} aria-label={label} title={label} {disabled} {...rest}>
		{@render children()}
	</button>
{/if}
