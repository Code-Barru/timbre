<script lang="ts">
	import type { NavItem } from './SidebarNav.svelte';

	interface Props {
		items: NavItem[];
		/** When set, a raised primary FAB is placed at the centre of the bar. */
		fabIcon?: any;
		fabLabel?: string;
		onfab?: () => void;
		class?: string;
	}
	let { items, fabIcon, fabLabel = 'Add', onfab, class: className = '' }: Props = $props();

	let mid = $derived(fabIcon ? Math.ceil(items.length / 2) : items.length);
	let left = $derived(items.slice(0, mid));
	let right = $derived(items.slice(mid));
</script>

<nav
	class="flex items-center justify-around rounded-xl w-6/7 mx-auto border border-border bg-surface px-2 py-2.5 shadow-md {className}"
>
	{#snippet navItem(item: NavItem)}
		{@const Icon = item.icon}
		{#if item.href}
			<a
				href={item.href}
				class="flex flex-col items-center gap-1 {item.active ? 'text-primary' : 'text-text-faint'}"
				aria-current={item.active ? 'page' : undefined}
			>
				<Icon size={21} />
				<span class="text-[10px] font-semibold">{item.label}</span>
			</a>
		{:else}
			<button
				type="button"
				onclick={item.onclick}
				class="flex flex-col items-center gap-1 {item.active ? 'text-primary' : 'text-text-faint'}"
				aria-current={item.active ? 'page' : undefined}
			>
				<Icon size={21} />
				<span class="text-[10px] font-semibold">{item.label}</span>
			</button>
		{/if}
	{/snippet}

	{#each left as item (item.label)}
		{@render navItem(item)}
	{/each}

	{#if fabIcon}
		{@const Fab = fabIcon}
		<button
			type="button"
			onclick={onfab}
			aria-label={fabLabel}
			class="inline-flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-primary text-text-inverse shadow-lg transition hover:bg-primary-hover"
		>
			<Fab size={22} />
		</button>
	{/if}

	{#each right as item (item.label)}
		{@render navItem(item)}
	{/each}
</nav>
