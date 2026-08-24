<script lang="ts">
	import type { Snippet } from 'svelte';

	type Density = 'compact' | 'default' | 'comfortable';

	interface Props {
		density?: Density;
		sticky?: boolean;
		caption?: string;
		head?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		density = 'default',
		sticky = false,
		caption,
		head,
		children,
		class: klass
	}: Props = $props();

	const densities: Record<Density, string> = {
		compact: 'text-sm [--cell-y:0.375rem]',
		default: 'text-sm [--cell-y:0.625rem]',
		comfortable: 'text-base [--cell-y:0.875rem]'
	};
</script>

<div class={['w-full overflow-x-auto rounded-lg border border-line-subtle', klass]}>
	<table class={['w-full border-collapse text-left', densities[density]]}>
		{#if caption}
			<caption class="px-3 py-2 text-left text-sm text-fg-muted">{caption}</caption>
		{/if}
		{#if head}
			<thead class={sticky ? 'sticky top-0 z-10' : ''}>
				{@render head()}
			</thead>
		{/if}
		<tbody>
			{@render children?.()}
		</tbody>
	</table>
</div>

<style>
	table :global(th) {
		background-color: var(--color-surface-sunken);
		color: var(--color-fg-muted);
		font-weight: 600;
		font-size: var(--text-xs);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: var(--cell-y) 0.75rem;
		border-bottom: 1px solid var(--color-line-subtle);
		white-space: nowrap;
	}

	table :global(td) {
		padding: var(--cell-y) 0.75rem;
		border-bottom: 1px solid var(--color-line-subtle);
		color: var(--color-fg);
	}

	table :global(tbody tr:last-child td) {
		border-bottom: 0;
	}

	table :global(tbody tr:hover td) {
		background-color: var(--color-surface-sunken);
	}
</style>
