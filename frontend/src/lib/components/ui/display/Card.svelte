<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'raised' | 'outline' | 'sunken';
	type Padding = 'none' | 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: Variant;
		padding?: Padding;
		interactive?: boolean;
		accent?: boolean;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		variant = 'raised',
		padding = 'md',
		interactive = false,
		accent = false,
		header,
		footer,
		children,
		class: klass,
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		raised: 'bg-surface-raised border border-line-subtle',
		outline: 'bg-transparent border border-line',
		sunken: 'bg-surface-sunken border border-transparent'
	};

	const paddings: Record<Padding, string> = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};
</script>

<div
	class={[
		'relative overflow-hidden rounded-lg transition-colors duration-150 ease-out',
		variants[variant],
		interactive && 'cursor-pointer focus-within:border-brand-line hover:border-brand-line',
		klass
	]}
	{...rest}
>
	{#if accent}
		<span
			class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-700 via-brand-400 to-brand-600"
			aria-hidden="true"
		></span>
	{/if}
	{#if header}
		<div class={['border-b border-line-subtle', paddings[padding === 'none' ? 'sm' : padding]]}>
			{@render header()}
		</div>
	{/if}
	<div class={paddings[padding]}>
		{@render children?.()}
	</div>
	{#if footer}
		<div
			class={[
				'border-t border-line-subtle bg-surface-sunken',
				paddings[padding === 'none' ? 'sm' : padding]
			]}
		>
			{@render footer()}
		</div>
	{/if}
</div>
