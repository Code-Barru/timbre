<script lang="ts">
	type Size = 'sm' | 'md';

	interface Props {
		keys: string[];
		size?: Size;
		separator?: string;
		class?: string;
	}

	let { keys, size = 'sm', separator = '', class: klass }: Props = $props();

	const sizes: Record<Size, string> = {
		sm: 'h-4.5 min-w-4.5 px-1 text-[0.6875rem]',
		md: 'h-5.5 min-w-5.5 px-1.5 text-xs'
	};
</script>

<span class={['inline-flex items-center gap-1', klass]}>
	{#each keys as key, index (key)}
		{#if index > 0 && separator}
			<span class="text-xs text-fg-muted">{separator}</span>
		{/if}
		<kbd
			class={[
				'inline-flex items-center justify-center rounded-xs border border-b-2 border-line-subtle bg-surface-sunken font-sans font-medium text-fg-secondary',
				sizes[size]
			]}
		>
			{key}
		</kbd>
	{/each}
</span>
