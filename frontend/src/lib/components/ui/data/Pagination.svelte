<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		page?: number;
		total: number;
		perPage?: number;
		siblings?: number;
		label?: string;
		class?: string;
	}

	let {
		page = $bindable(1),
		total,
		perPage = 20,
		siblings = 1,
		label = 'Pagination',
		class: klass
	}: Props = $props();

	const pageCount = $derived(Math.max(1, Math.ceil(total / perPage)));

	const pages = $derived.by(() => {
		const first = 1;
		const last = pageCount;
		const from = Math.max(first, page - siblings);
		const to = Math.min(last, page + siblings);
		const items: (number | 'gap')[] = [];

		if (from > first) {
			items.push(first);
			if (from > first + 1) items.push('gap');
		}
		for (let current = from; current <= to; current += 1) items.push(current);
		if (to < last) {
			if (to < last - 1) items.push('gap');
			items.push(last);
		}
		return items;
	});

	function go(next: number) {
		page = Math.min(pageCount, Math.max(1, next));
	}
</script>

<nav aria-label={label} class={['flex items-center gap-1', klass]}>
	<button
		type="button"
		aria-label="Previous page"
		disabled={page <= 1}
		onclick={() => go(page - 1)}
		class="inline-flex size-8 items-center justify-center rounded-md text-fg-secondary transition-colors duration-150 ease-out hover:bg-neutral-subtle disabled:pointer-events-none disabled:opacity-40"
	>
		<ChevronLeft class="size-4" aria-hidden="true" />
	</button>
	{#each pages as item, index (index)}
		{#if item === 'gap'}
			<span class="px-1 text-sm text-fg-muted">…</span>
		{:else}
			<button
				type="button"
				aria-current={item === page ? 'page' : undefined}
				onclick={() => go(item)}
				class={[
					'inline-flex size-8 items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-150 ease-out',
					item === page
						? 'bg-brand-solid font-semibold text-brand-on-solid'
						: 'text-fg-secondary hover:bg-neutral-subtle'
				]}
			>
				{item}
			</button>
		{/if}
	{/each}
	<button
		type="button"
		aria-label="Next page"
		disabled={page >= pageCount}
		onclick={() => go(page + 1)}
		class="inline-flex size-8 items-center justify-center rounded-md text-fg-secondary transition-colors duration-150 ease-out hover:bg-neutral-subtle disabled:pointer-events-none disabled:opacity-40"
	>
		<ChevronRight class="size-4" aria-hidden="true" />
	</button>
</nav>
