<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { toasts } from './toast';
	import Toast from './Toast.svelte';
</script>

<div
	class="pointer-events-none fixed top-4 right-4 flex w-full max-w-[380px] flex-col gap-2"
	style="z-index:var(--z-index-toast)"
	aria-live="polite"
>
	{#each $toasts as item (item.id)}
		<div
			class="pointer-events-auto"
			in:fly={{ x: 24, duration: 220 }}
			out:fly={{ x: 24, duration: 180 }}
			animate:flip={{ duration: 200 }}
		>
			<Toast toast={item} />
		</div>
	{/each}
</div>
