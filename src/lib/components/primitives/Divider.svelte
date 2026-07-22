<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		orientation?: 'horizontal' | 'vertical';
		/** Optional centered label (horizontal only). */
		children?: Snippet;
		class?: string;
	}
	let { orientation = 'horizontal', children, class: className = '' }: Props = $props();
</script>

{#if orientation === 'vertical'}
	<div
		class="w-px self-stretch bg-border {className}"
		role="separator"
		aria-orientation="vertical"
	></div>
{:else if children}
	<div class="flex items-center gap-3.5 {className}" role="separator">
		<span class="h-px flex-1 bg-border"></span>
		<span class="text-label font-semibold tracking-wider text-text-faint uppercase">
			{@render children()}
		</span>
		<span class="h-px flex-1 bg-border"></span>
	</div>
{:else}
	<div class="h-px w-full bg-border {className}" role="separator"></div>
{/if}
