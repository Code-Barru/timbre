<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { X } from '@lucide/svelte';
	import { IconButton } from '$lib/components/primitives';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		open?: boolean;
		title?: string;
		size?: Size;
		closeButton?: boolean;
		onclose?: () => void;
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
		class?: string;
	}
	let {
		open = $bindable(false),
		title,
		size = 'md',
		closeButton = true,
		onclose,
		children,
		header,
		footer,
		class: className = ''
	}: Props = $props();

	const sizes: Record<Size, string> = {
		sm: 'max-w-[360px]',
		md: 'max-w-[440px]',
		lg: 'max-w-[560px]'
	};

	let panel = $state<HTMLDivElement | null>(null);

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

	// Prevent body scroll + focus panel while open.
	$effect(() => {
		if (open) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			// Focus the panel once mounted.
			queueMicrotask(() => panel?.focus());
			return () => {
				document.body.style.overflow = prev;
			};
		}
	});
</script>

<svelte:window on:keydown={open ? onkeydown : undefined} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50"
		style="z-index:var(--z-index-overlay)"
		transition:fade={{ duration: 150 }}
		onclick={close}
		aria-hidden="true"
	></div>

	<!-- Panel wrapper (centres the dialog) -->
	<div
		class="fixed inset-0 flex items-center justify-center p-4"
		style="z-index:var(--z-index-modal)"
	>
		<div
			bind:this={panel}
			class="w-full {sizes[
				size
			]} overflow-hidden rounded-lg bg-surface shadow-xl outline-none {className}"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabindex="-1"
			transition:scale={{ duration: 180, start: 0.96, opacity: 0 }}
		>
			{#if header}
				{@render header()}
			{:else if title || closeButton}
				<div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
					<span class="text-h4 font-semibold text-text">{title}</span>
					{#if closeButton}
						<IconButton label="Close" variant="ghost" size="sm" onclick={close}>
							<X size={18} />
						</IconButton>
					{/if}
				</div>
			{/if}

			<div class="px-5 py-5">
				{@render children()}
			</div>

			{#if footer}
				<div class="flex items-center justify-end gap-2.5 border-t border-border px-5 py-4">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
