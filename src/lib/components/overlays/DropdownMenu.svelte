<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import { scale } from 'svelte/transition';
	import { Divider } from '$lib/components/primitives';

	interface MenuItem {
		label: string;
		icon?: Component;
		shortcut?: string;
		danger?: boolean;
		separator?: boolean;
		onselect?: () => void;
	}

	interface Props {
		open?: boolean;
		trigger: Snippet;
		items: MenuItem[];
		class?: string;
	}
	let {
		open = $bindable(false),
		trigger,
		items,
		class: className = ''
	}: Props = $props();

	let root = $state<HTMLDivElement | null>(null);

	function toggle() {
		open = !open;
	}

	function select(item: MenuItem) {
		item.onselect?.();
		open = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	$effect(() => {
		if (!open) return;
		function onWindowClick(e: MouseEvent) {
			if (root && !root.contains(e.target as Node)) open = false;
		}
		window.addEventListener('click', onWindowClick);
		return () => window.removeEventListener('click', onWindowClick);
	});
</script>

<svelte:window on:keydown={open ? onkeydown : undefined} />

<div bind:this={root} class="relative block w-full">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div onclick={toggle} role="button" tabindex="-1">
		{@render trigger()}
	</div>

	{#if open}
		<div
			class="absolute left-0 bottom-full z-10 mb-2 min-w-[230px] rounded-lg border border-border bg-surface p-1.5 shadow-xl {className}"
			role="menu"
			transition:scale={{ duration: 140, start: 0.96, opacity: 0 }}
		>
			{#each items as item (item.label)}
				{#if item.separator}
					<Divider class="my-1" />
				{/if}
				{@const Icon = item.icon}
				<button
					type="button"
					role="menuitem"
					class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium transition hover:bg-surface-sunken {item.danger
						? 'text-danger'
						: 'text-text'}"
					onclick={() => select(item)}
				>
					{#if Icon}
						<Icon size={16} />
					{/if}
					<span class="flex-1">{item.label}</span>
					{#if item.shortcut}
						<span class="font-mono text-xs text-text-faint">{item.shortcut}</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
