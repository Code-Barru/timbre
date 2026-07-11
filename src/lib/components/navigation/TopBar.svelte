<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		/** Right-aligned actions. */
		children?: Snippet;
		class?: string;
	}
	let { title, children, class: className = '' }: Props = $props();
</script>

<header
	class="flex h-[60px] flex-none items-center gap-3.5 border-b border-border px-6 {className}"
>
	{#if title}
		<span class="text-lg font-bold text-text">{title}</span>
	{/if}
	{#if children}
		<div class="ml-auto flex items-center gap-3">{@render children()}</div>
	{/if}
</header>
