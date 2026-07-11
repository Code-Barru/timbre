<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	}
	let {
		checked = $bindable(false),
		disabled = false,
		label,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	function toggle() {
		if (!disabled) checked = !checked;
	}
</script>

<label
	class="inline-flex items-center gap-2.5 {disabled
		? 'cursor-not-allowed text-text-faint'
		: 'cursor-pointer text-text'} {className}"
>
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label}
		{disabled}
		onclick={toggle}
		class="relative h-6 w-[42px] flex-none rounded-full transition {checked && !disabled
			? 'bg-primary'
			: 'bg-border-strong'} {disabled ? 'bg-border' : ''}"
		{...rest}
	>
		<span
			class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all {checked
				? 'left-5'
				: 'left-0.5'}"
		></span>
	</button>
	{#if children}<span class="text-sm">{@render children()}</span>{/if}
</label>
