<script lang="ts">
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import X from '@lucide/svelte/icons/x';
	import type { Toast } from './toasts.svelte';

	interface Props {
		toast: Toast;
		dismissLabel?: string;
		ondismiss?: () => void;
		onpause?: () => void;
		onresume?: () => void;
	}

	let { toast, dismissLabel = 'Dismiss', ondismiss, onpause, onresume }: Props = $props();

	const icons = {
		brand: Info,
		danger: CircleAlert,
		warning: TriangleAlert,
		success: CircleCheck
	};

	const accents: Record<Toast['tone'], string> = {
		brand: 'text-brand-fg',
		danger: 'text-danger-fg',
		warning: 'text-warning-fg',
		success: 'text-success-fg'
	};

	const ToneIcon = $derived(icons[toast.tone]);
</script>

<div
	class="flex w-80 items-start gap-3 rounded-lg border border-line-subtle bg-surface-overlay p-3 shadow-overlay"
	onmouseenter={onpause}
	onmouseleave={onresume}
	onfocusin={onpause}
	onfocusout={onresume}
	role="presentation"
>
	<ToneIcon class={['mt-0.5 size-4.5 shrink-0', accents[toast.tone]]} aria-hidden="true" />
	<div class="flex-1 space-y-0.5">
		<p class="text-sm font-semibold text-fg">{toast.title}</p>
		{#if toast.description}
			<p class="text-sm text-fg-muted">{toast.description}</p>
		{/if}
	</div>
	<button
		type="button"
		aria-label={dismissLabel}
		onclick={ondismiss}
		class="-m-1 shrink-0 rounded-xs p-1 text-fg-muted transition-colors duration-150 ease-out hover:text-fg"
	>
		<X class="size-4" aria-hidden="true" />
	</button>
</div>
