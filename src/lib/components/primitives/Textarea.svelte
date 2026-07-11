<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		rows?: number;
		invalid?: boolean;
		disabled?: boolean;
		class?: string;
		[key: string]: unknown;
	}
	let {
		value = $bindable(''),
		placeholder,
		rows = 3,
		invalid = false,
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const base =
		'w-full rounded border bg-surface px-3 py-2.5 text-sm leading-relaxed text-text placeholder:text-text-faint transition focus:border-primary disabled:bg-surface-sunken disabled:text-text-faint disabled:cursor-not-allowed';
	let borderCls = $derived(invalid ? 'border-danger' : 'border-border-strong');
</script>

<textarea {rows} {placeholder} {disabled} bind:value class="{base} {borderCls} {className}" {...rest}
></textarea>
