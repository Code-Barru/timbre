<script lang="ts">
	import type { Snippet } from 'svelte';
	import SidebarNav, { type NavItem } from './SidebarNav.svelte';
	import TopBar from './TopBar.svelte';

	interface Props {
		items: NavItem[];
		title?: string;
		brand?: string;
		/** Pinned to the bottom of the sidebar. */
		sidebarFooter?: Snippet;
		/** Right-aligned actions in the top bar. */
		actions?: Snippet;
		/** Main content. */
		children: Snippet;
		class?: string;
	}
	let {
		items,
		title,
		brand = 'Timbre',
		sidebarFooter,
		actions,
		children,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex overflow-hidden rounded-lg border border-border bg-surface {className}">
	<SidebarNav {items} {brand} footer={sidebarFooter} />

	<div class="flex min-w-0 flex-1 flex-col">
		<TopBar {title}>
			{#if actions}
				{@render actions()}
			{/if}
		</TopBar>
		<main class="flex-1 overflow-auto bg-surface-sunken p-6">
			{@render children()}
		</main>
	</div>
</div>
