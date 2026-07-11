<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { Input } from '$lib/components/primitives';

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
	}
	let {
		value = $bindable(''),
		placeholder = 'Search…',
		disabled = false,
		class: className = ''
	}: Props = $props();

	function clear() {
		value = '';
	}
</script>

<Input bind:value {placeholder} {disabled} type="search" class={className}>
	{#snippet leading()}
		<Search size={16} class="text-text-faint" />
	{/snippet}
	{#snippet trailing()}
		{#if value}
			<button
				type="button"
				aria-label="Clear search"
				onclick={clear}
				class="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-surface-sunken text-text-muted transition hover:text-text"
			>
				<X size={11} />
			</button>
		{/if}
	{/snippet}
</Input>
