<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		open?: boolean;
		title?: string;
		onclose?: () => void;
		children: Snippet;
		class?: string;
	}
	let {
		open = $bindable(false),
		title,
		onclose,
		children,
		class: className = ''
	}: Props = $props();

	function close() {
		open = false;
		onclose?.();
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.stopPropagation();
			close();
		}
	}

	$effect(() => {
		if (open) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = prev;
			};
		}
	});
</script>

<svelte:window on:keydown={open ? onkeydown : undefined} />

{#if open}
	<div
		class="fixed inset-0 bg-black/50"
		style="z-index:var(--z-index-overlay)"
		transition:fade={{ duration: 150 }}
		onclick={close}
		aria-hidden="true"
	></div>

	<div class="fixed inset-x-0 bottom-0 flex justify-center" style="z-index:var(--z-index-modal)">
		<div
			class="w-full max-w-[540px] rounded-t-xl bg-surface px-4.5 pt-4 pb-6 shadow-xl {className}"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			transition:fly={{ y: 400, duration: 260, opacity: 1 }}
		>
			<div class="mx-auto mb-4 h-1 w-9 rounded-full bg-border-strong"></div>
			{#if title}
				<div class="mb-3 text-h4 font-bold text-text">{title}</div>
			{/if}
			{@render children()}
		</div>
	</div>
{/if}
