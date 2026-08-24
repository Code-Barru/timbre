<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fetchMe } from '$lib/state/auth.svelte';
	import ToastHost from '$lib/components/ui/feedback/ToastHost.svelte';

	let { children } = $props();

	onMount(() => {
		fetchMe();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen w-full bg-surface-base text-fg">
	{@render children()}
</div>
<ToastHost />
