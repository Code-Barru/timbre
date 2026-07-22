<script lang="ts">
	interface Props {
		newCount?: number;
		due?: number;
		learning?: number;
		class?: string;
	}
	let { newCount = 0, due = 0, learning = 0, class: className = '' }: Props = $props();

	type Segment = { count: number; label: string; text: string; dot: string };
	const all: Segment[] = $derived([
		{ count: newCount, label: 'new', text: 'text-info', dot: 'bg-info' },
		{ count: due, label: 'due', text: 'text-warning', dot: 'bg-warning' },
		{ count: learning, label: 'learning', text: 'text-success', dot: 'bg-success' }
	]);
	let segments = $derived(all.some((s) => s.count > 0) ? all.filter((s) => s.count > 0) : all);
</script>

<div
	class="inline-flex w-fit items-center overflow-hidden rounded-full border border-border {className}"
>
	{#each segments as seg, i (seg.label)}
		{#if i > 0}
			<span class="w-px self-stretch bg-border"></span>
		{/if}
		<span class="inline-flex items-center gap-1.5 px-4 py-2 text-caption font-semibold {seg.text}">
			<span class="h-2 w-2 flex-none rounded-full {seg.dot}"></span>
			{seg.count}
			{seg.label}
		</span>
	{/each}
</div>
