<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fetchMe } from '$lib/state/auth.svelte';

	let { children } = $props();

	onMount(() => {
		fetchMe();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="h-screen w-screen bg-slate-700 text-slate-200">
	{@render children()}
</div>
