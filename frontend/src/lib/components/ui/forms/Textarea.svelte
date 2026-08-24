<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { getFieldContext } from './field';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		invalid?: boolean;
		autoresize?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		invalid = false,
		autoresize = false,
		rows = 4,
		disabled = false,
		readonly = false,
		id,
		class: klass,
		...rest
	}: Props = $props();

	const field = getFieldContext();

	let element = $state<HTMLTextAreaElement | null>(null);

	const textareaId = $derived(id ?? field?.id);
	const isInvalid = $derived(invalid || field?.invalid || false);

	$effect(() => {
		if (!autoresize || !element) return;
		void value;
		element.style.height = 'auto';
		element.style.height = `${element.scrollHeight}px`;
	});
</script>

<textarea
	bind:this={element}
	id={textareaId}
	bind:value
	{rows}
	{disabled}
	{readonly}
	aria-invalid={isInvalid || undefined}
	aria-describedby={field?.describedBy}
	required={field?.required}
	class={[
		'w-full rounded-md border bg-surface-raised px-3 py-2 text-sm text-fg transition-colors duration-150 ease-out placeholder:text-fg-muted disabled:pointer-events-none disabled:opacity-50',
		isInvalid ? 'border-danger-solid' : 'border-line focus:border-brand-solid',
		readonly && 'bg-surface-sunken',
		autoresize && 'resize-none overflow-hidden',
		klass
	]}
	{...rest}></textarea>
