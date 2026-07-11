<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		children: Snippet;
		class?: string;
	}
	let { children, class: className = '' }: Props = $props();
</script>

<kbd
	class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border border-b-2 bg-surface-sunken px-1.5 font-mono text-xs font-semibold text-text-muted {className}"
>
	{@render children()}
</kbd>
