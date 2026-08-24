<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { theme } from '$lib/state/theme.svelte';
	import IconButton from './IconButton.svelte';

	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { size = 'md', class: klass }: Props = $props();
</script>

<IconButton
	{size}
	class={klass}
	label={theme.resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	onclick={() => theme.toggle()}
>
	{#if theme.resolved === 'dark'}
		<Sun class="size-4.5" aria-hidden="true" />
	{:else}
		<Moon class="size-4.5" aria-hidden="true" />
	{/if}
</IconButton>
