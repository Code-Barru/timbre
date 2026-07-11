<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Check } from '@lucide/svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: Snippet;
		action?: Snippet;
		class?: string;
	}
	let { title, description, icon, action, class: className = '' }: Props = $props();
</script>

<div class="flex flex-col items-center px-7 py-10 text-center {className}">
	<span
		class="inline-flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-primary-subtle text-primary"
	>
		{#if icon}{@render icon()}{:else}<Check size={34} />{/if}
	</span>
	<div class="mt-4.5 text-h4 font-bold text-text">{title}</div>
	{#if description}
		<p class="mt-1.5 max-w-xs text-caption leading-relaxed text-text-muted">{description}</p>
	{/if}
	{#if action}
		<div class="mt-5">{@render action()}</div>
	{/if}
</div>
