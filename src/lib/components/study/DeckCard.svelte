<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MoreVertical } from '@lucide/svelte';
	import ProgressRing from '$lib/components/primitives/ProgressRing.svelte';
	import Badge from '$lib/components/primitives/Badge.svelte';
	import IconButton from '$lib/components/primitives/IconButton.svelte';

	interface Props {
		name: string;
		newCount?: number;
		due?: number;
		/** 0–100 */
		mastery: number;
		menu?: Snippet;
		onclick?: () => void;
		class?: string;
	}
	let {
		name,
		newCount = 0,
		due = 0,
		mastery,
		menu,
		onclick,
		class: className = ''
	}: Props = $props();

	let ringTone = $derived<'success' | 'warning' | 'primary'>(
		mastery >= 80 ? 'success' : mastery < 50 ? 'warning' : 'primary'
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="flex items-center gap-4 rounded-xl border border-border p-4 {onclick
		? 'cursor-pointer'
		: ''} {className}"
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
	{onclick}
	onkeydown={onclick
		? (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onclick?.();
				}
			}
		: undefined}
>
	<ProgressRing value={mastery} size={52} stroke={5} tone={ringTone} showValue class="flex-none" />

	<div class="min-w-0 flex-1">
		<div class="truncate text-h4 font-bold text-text">{name}</div>
		<div class="mt-1.5 flex gap-2">
			<Badge variant="info">{newCount} new</Badge>
			<Badge variant="warning">{due} due</Badge>
		</div>
	</div>

	{#if menu}
		{@render menu()}
	{:else}
		<IconButton label="Deck options" variant="ghost" size="sm" class="flex-none">
			<MoreVertical size={18} />
		</IconButton>
	{/if}
</div>
