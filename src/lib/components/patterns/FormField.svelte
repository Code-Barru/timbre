<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AlertTriangle } from '@lucide/svelte';

	interface Props {
		label?: string;
		required?: boolean;
		help?: string;
		error?: string;
		/** Associates the label with the wrapped control. */
		id?: string;
		children: Snippet;
		class?: string;
	}
	let {
		label,
		required = false,
		help,
		error,
		id,
		children,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex flex-col {className}">
	{#if label}
		<label for={id} class="mb-1.5 flex items-center gap-1 text-label font-semibold text-text">
			{label}
			{#if required}<span class="text-danger">*</span>{/if}
		</label>
	{/if}
	{@render children()}
	{#if error}
		<div class="mt-1.5 flex items-center gap-1.5 text-caption font-medium text-danger">
			<AlertTriangle size={13} />
			{error}
		</div>
	{:else if help}
		<div class="mt-1.5 text-caption text-text-faint">{help}</div>
	{/if}
</div>
