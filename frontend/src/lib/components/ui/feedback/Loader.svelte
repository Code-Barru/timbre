<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Size = 'xs' | 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		size?: Size;
		label?: string;
		class?: string;
	}

	let { size = 'md', label = 'Loading', class: klass, ...rest }: Props = $props();

	const sizes: Record<Size, string> = {
		xs: 'size-3',
		sm: 'size-3.5',
		md: 'size-4',
		lg: 'size-5'
	};
</script>

<span role="status" aria-label={label} class={['inline-flex', klass]} {...rest}>
	<svg
		class={['animate-spin-slow motion-reduce:animate-none', sizes[size]]}
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
		<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
</span>
