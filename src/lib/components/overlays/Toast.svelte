<script lang="ts">
	import { X, Check, AlertTriangle } from '@lucide/svelte';
	import { IconButton } from '$lib/components/primitives';
	import { toast as toastStore, type Toast, type ToastVariant } from './toast';

	interface Props {
		toast: Toast;
		class?: string;
	}
	let { toast, class: className = '' }: Props = $props();

	const isDark = $derived(toast.variant === 'message');

	const iconWrap: Record<ToastVariant, string> = {
		success: 'bg-success-subtle text-success',
		danger: 'bg-danger-subtle text-danger',
		info: 'bg-info-subtle text-info',
		message: 'bg-white/12 text-violet-300'
	};

	function dismiss() {
		toastStore.dismiss(toast.id);
	}

	function runAction() {
		toast.action?.onclick();
		dismiss();
	}
</script>

<div
	class="flex items-center gap-3 rounded-lg border p-3.5 shadow-lg {isDark
		? 'border-transparent bg-neutral-900 text-white'
		: 'border-border bg-surface text-text'} {className}"
	role="status"
>
	<span
		class="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-full {iconWrap[
			toast.variant
		]}"
	>
		{#if toast.variant === 'success'}
			<Check size={16} />
		{:else if toast.variant === 'danger'}
			<AlertTriangle size={16} />
		{:else if toast.variant === 'info'}
			<Check size={16} />
		{/if}
	</span>

	<span class="flex-1 text-sm font-medium">{toast.message}</span>

	{#if toast.action}
		<button
			type="button"
			class="flex-none text-sm font-semibold {isDark ? 'text-violet-300' : 'text-primary'}"
			onclick={runAction}
		>
			{toast.action.label}
		</button>
	{:else if isDark}
		<button
			type="button"
			aria-label="Dismiss"
			class="flex-none text-white/70 hover:text-white"
			onclick={dismiss}
		>
			<X size={16} />
		</button>
	{:else}
		<IconButton label="Dismiss" variant="ghost" size="sm" onclick={dismiss}>
			<X size={16} />
		</IconButton>
	{/if}
</div>
