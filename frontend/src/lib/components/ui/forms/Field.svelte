<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setFieldContext } from './field';

	interface Props {
		label?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		id?: string;
		orientation?: 'vertical' | 'horizontal';
		children?: Snippet;
		class?: string;
	}

	let {
		label,
		hint,
		error,
		required = false,
		id,
		orientation = 'vertical',
		children,
		class: klass
	}: Props = $props();

	const uid = $props.id();
	const fieldId = $derived(id ?? uid);
	const hintId = $derived(`${fieldId}-hint`);
	const errorId = $derived(`${fieldId}-error`);

	const describedBy = $derived(
		[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
	);

	setFieldContext({
		get id() {
			return fieldId;
		},
		get describedBy() {
			return describedBy;
		},
		get invalid() {
			return Boolean(error);
		},
		get required() {
			return required;
		}
	});
</script>

<div
	class={[
		orientation === 'horizontal'
			? 'flex flex-wrap items-center gap-x-4 gap-y-1'
			: 'flex flex-col gap-1.5',
		klass
	]}
>
	{#if label}
		<label for={fieldId} class="text-sm font-medium text-fg">
			{label}
			{#if required}
				<span class="text-danger-fg" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}
	<div class={orientation === 'horizontal' ? 'min-w-0 flex-1' : ''}>
		{@render children?.()}
	</div>
	{#if error}
		<p id={errorId} class="text-sm text-danger-fg">{error}</p>
	{:else if hint}
		<p id={hintId} class="text-sm text-fg-muted">{hint}</p>
	{/if}
</div>
