<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'solid' | 'soft' | 'outline';
	type Tone = 'brand' | 'neutral' | 'danger' | 'warning' | 'success';
	type Size = 'sm' | 'md';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: Variant;
		tone?: Tone;
		size?: Size;
		dot?: boolean;
		children?: Snippet;
		class?: string;
	}

	let {
		variant = 'soft',
		tone = 'neutral',
		size = 'md',
		dot = false,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const base = 'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap';

	const variants: Record<Variant, Record<Tone, string>> = {
		solid: {
			brand: 'bg-brand-solid text-brand-on-solid',
			neutral: 'bg-neutral-solid text-neutral-on-solid',
			danger: 'bg-danger-solid text-danger-on-solid',
			warning: 'bg-warning-solid text-warning-on-solid',
			success: 'bg-success-solid text-success-on-solid'
		},
		soft: {
			brand: 'bg-brand-subtle text-brand-fg',
			neutral: 'bg-neutral-subtle text-neutral-fg',
			danger: 'bg-danger-subtle text-danger-fg',
			warning: 'bg-warning-subtle text-warning-fg',
			success: 'bg-success-subtle text-success-fg'
		},
		outline: {
			brand: 'border border-brand-line text-brand-fg',
			neutral: 'border border-line text-fg-secondary',
			danger: 'border border-danger-line text-danger-fg',
			warning: 'border border-warning-line text-warning-fg',
			success: 'border border-success-line text-success-fg'
		}
	};

	const sizes: Record<Size, string> = {
		sm: 'h-5 px-2 text-[0.6875rem]',
		md: 'h-6 px-2.5 text-xs'
	};
</script>

<span class={[base, variants[variant][tone], sizes[size], klass]} {...rest}>
	{#if dot}
		<span class="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true"></span>
	{/if}
	{@render children?.()}
</span>
