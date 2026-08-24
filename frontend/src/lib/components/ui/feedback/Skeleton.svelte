<script lang="ts">
	interface Props {
		type?: 'text' | 'circle' | 'rect' | 'card' | 'list';
		lines?: number;
		width?: string;
		height?: string;
		radius?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
		animate?: boolean;
		class?: string;
	}

	let {
		type = 'text',
		lines = 3,
		width,
		height,
		radius = 'sm',
		animate = true,
		class: klass
	}: Props = $props();

	const radii: Record<NonNullable<Props['radius']>, string> = {
		xs: 'rounded-xs',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full'
	};

	const rows = $derived(Array.from({ length: Math.max(1, lines) }, (_, index) => index));
</script>

{#snippet block(shape: string, style?: string)}
	<span class={['relative block overflow-hidden bg-surface-sunken', shape]} {style}>
		{#if animate}
			<span
				class="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,var(--color-line-subtle),transparent)] bg-[length:60%_100%] bg-no-repeat motion-reduce:animate-none"
			></span>
		{/if}
	</span>
{/snippet}

{#if type === 'text'}
	<span class={['flex flex-col gap-2', klass]} aria-hidden="true">
		{#each rows as row (row)}
			{@render block(
				['h-3.5 w-full', radii[radius], row === rows.length - 1 && rows.length > 1 && 'w-3/5']
					.filter(Boolean)
					.join(' ')
			)}
		{/each}
	</span>
{:else if type === 'circle'}
	<span class={['inline-flex', klass]} aria-hidden="true">
		{@render block(
			'rounded-full',
			`width: ${width ?? '2.5rem'}; height: ${height ?? width ?? '2.5rem'}`
		)}
	</span>
{:else if type === 'rect'}
	<span class={['inline-flex', klass]} aria-hidden="true">
		{@render block(radii[radius], `width: ${width ?? '100%'}; height: ${height ?? '6rem'}`)}
	</span>
{:else if type === 'card'}
	<span
		class={['flex flex-col gap-3 rounded-lg border border-line-subtle p-4', klass]}
		aria-hidden="true"
	>
		{@render block('rounded-md w-full', `height: ${height ?? '8rem'}`)}
		{@render block('h-4 w-2/5 rounded-sm')}
		<span class="flex flex-col gap-2">
			{@render block('h-3 w-full rounded-sm')}
			{@render block('h-3 w-4/5 rounded-sm')}
		</span>
	</span>
{:else}
	<span class={['flex flex-col gap-4', klass]} aria-hidden="true">
		{#each rows as row (row)}
			<span class="flex items-center gap-3">
				{@render block('rounded-full size-10 shrink-0')}
				<span class="flex flex-1 flex-col gap-2">
					{@render block('h-3.5 w-1/3 rounded-sm')}
					{@render block('h-3 w-3/4 rounded-sm')}
				</span>
			</span>
		{/each}
	</span>
{/if}
