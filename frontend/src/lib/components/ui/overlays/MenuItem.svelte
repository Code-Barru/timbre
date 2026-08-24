<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onselect?: () => void;
		disabled?: boolean;
		tone?: 'neutral' | 'danger';
		icon?: Snippet;
		shortcut?: Snippet;
		children: Snippet;
		class?: string;
	}

	let {
		onselect,
		disabled = false,
		tone = 'neutral',
		icon,
		shortcut,
		children,
		class: klass
	}: Props = $props();

	const tones = {
		neutral: 'text-fg hover:bg-neutral-subtle focus:bg-neutral-subtle',
		danger: 'text-danger-fg hover:bg-danger-subtle focus:bg-danger-subtle'
	};
</script>

<button
	type="button"
	role="menuitem"
	tabindex="-1"
	{disabled}
	onclick={onselect}
	class={[
		'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left text-sm transition-colors duration-150 ease-out outline-none disabled:pointer-events-none disabled:opacity-50',
		tones[tone],
		klass
	]}
>
	{#if icon}
		<span class="shrink-0 text-fg-muted">{@render icon()}</span>
	{/if}
	<span class="flex-1">{@render children()}</span>
	{#if shortcut}
		<span class="shrink-0">{@render shortcut()}</span>
	{/if}
</button>
