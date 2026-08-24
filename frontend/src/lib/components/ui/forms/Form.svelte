<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	interface Props extends HTMLFormAttributes {
		gap?: 'sm' | 'md' | 'lg';
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let { gap = 'md', actions, children, class: klass, ...rest }: Props = $props();

	const gaps = {
		sm: 'gap-3',
		md: 'gap-4',
		lg: 'gap-6'
	};
</script>

<form novalidate class={['flex flex-col', gaps[gap], klass]} {...rest}>
	{@render children?.()}
	{#if actions}
		<div class="flex flex-wrap items-center justify-end gap-2 pt-1">
			{@render actions()}
		</div>
	{/if}
</form>
