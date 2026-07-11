<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/primitives';
	import Modal from './Modal.svelte';

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		destructive?: boolean;
		icon?: Snippet;
		onconfirm: () => void;
		oncancel?: () => void;
	}
	let {
		open = $bindable(false),
		title,
		description,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		destructive = false,
		icon,
		onconfirm,
		oncancel
	}: Props = $props();

	function confirm() {
		onconfirm();
		open = false;
	}
	function cancel() {
		open = false;
		oncancel?.();
	}
</script>

<Modal bind:open size="sm" closeButton={false} onclose={oncancel}>
	<div class="flex flex-col items-center px-1 text-center">
		<span
			class="inline-flex h-12 w-12 items-center justify-center rounded-full {destructive
				? 'bg-danger-subtle text-danger'
				: 'bg-primary-subtle text-primary'}"
		>
			{#if icon}
				{@render icon()}
			{:else if destructive}
				<Trash2 size={22} />
			{/if}
		</span>

		<div class="mt-3.5 text-h4 font-bold text-text">{title}</div>
		{#if description}
			<p class="mt-1.5 text-sm leading-relaxed text-text-muted">{description}</p>
		{/if}

		<div class="mt-5 flex w-full gap-2.5">
			<Button variant="secondary" block onclick={cancel}>{cancelLabel}</Button>
			<Button variant={destructive ? 'destructive' : 'primary'} block onclick={confirm}>
				{confirmLabel}
			</Button>
		</div>
	</div>
</Modal>
