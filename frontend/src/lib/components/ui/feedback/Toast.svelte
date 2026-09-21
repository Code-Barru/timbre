<script lang="ts">
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import WarningCircleIcon from 'phosphor-svelte/lib/WarningCircleIcon';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';
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
		brand: InfoIcon,
		danger: WarningCircleIcon,
		warning: WarningIcon,
		success: CheckCircleIcon
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
		<XIcon class="size-4" aria-hidden="true" />
	</button>
</div>
