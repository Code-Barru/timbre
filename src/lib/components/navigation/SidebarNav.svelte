<script module lang="ts">
	export type NavItem = {
		label: string;
		icon: any;
		href?: string;
		badge?: string | number;
		active?: boolean;
		onclick?: () => void;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		items: NavItem[];
		brand?: string;
		/** Overrides the default lettered square. */
		logo?: Snippet;
		/** Pinned to the bottom of the column. */
		footer?: Snippet;
		class?: string;
	}
	let { items, brand = 'Timbre', logo, footer, class: className = '' }: Props = $props();

	let initial = $derived(brand.trim().charAt(0).toUpperCase());
</script>

<nav
	class="flex w-[212px] flex-none flex-col border-r border-border bg-surface-raised px-3.5 py-[18px] {className}"
>
	<div class="flex items-center gap-2.5 px-2 pb-1.5">
		{#if logo}
			{@render logo()}
		{:else}
			<span
				class="inline-flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-primary text-[15px] font-extrabold text-text-inverse"
			>
				{initial}
			</span>
		{/if}
		<span class="text-base font-extrabold tracking-tight text-text">{brand}</span>
	</div>

	<div class="mt-4 flex flex-col gap-[3px]">
		{#each items as item (item.label)}
			{@const Icon = item.icon}
			{#if item.href}
				<a
					href={item.href}
					class="flex items-center gap-[11px] rounded-md px-[11px] py-[9px] text-sm font-semibold transition {item.active
						? 'bg-primary-subtle text-primary'
						: 'text-text-muted hover:bg-surface-sunken'}"
					aria-current={item.active ? 'page' : undefined}
				>
					<Icon size={18} class="flex-none" />
					<span class="min-w-0 flex-1 truncate">{item.label}</span>
					{#if item.badge}
						<span class="font-mono text-[11px] font-bold text-primary">{item.badge}</span>
					{/if}
				</a>
			{:else}
				<button
					type="button"
					onclick={item.onclick}
					class="flex items-center gap-[11px] rounded-md px-[11px] py-[9px] text-left text-sm font-semibold transition {item.active
						? 'bg-primary-subtle text-primary'
						: 'text-text-muted hover:bg-surface-sunken'}"
					aria-current={item.active ? 'page' : undefined}
				>
					<Icon size={18} class="flex-none" />
					<span class="min-w-0 flex-1 truncate">{item.label}</span>
					{#if item.badge}
						<span class="font-mono text-[11px] font-bold text-primary">{item.badge}</span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>

	{#if footer}
		<div class="mt-auto">{@render footer()}</div>
	{/if}
</nav>
