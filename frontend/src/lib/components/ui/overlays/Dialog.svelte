<script lang="ts">
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';

	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		size?: Size;
		dismissible?: boolean;
		closeLabel?: string;
		footer?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		open = $bindable(false),
		title,
		description,
		size = 'md',
		dismissible = true,
		closeLabel = 'Close',
		footer,
		children,
		class: klass
	}: Props = $props();

	const id = $props.id();

	const sizes: Record<Size, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl'
	};

	let element = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!element) return;
		if (open && !element.open) element.showModal();
		else if (!open && element.open) element.close();
	});
</script>

<dialog
	bind:this={element}
	aria-labelledby="{id}-title"
	aria-describedby={description ? `${id}-description` : undefined}
	onclose={() => (open = false)}
	oncancel={(event) => {
		if (!dismissible) event.preventDefault();
	}}
	onpointerdown={(event) => {
		if (dismissible && event.target === element) open = false;
	}}
	class={[
		'm-auto w-[calc(100vw-2rem)] rounded-xl border border-line-subtle bg-surface-overlay p-0 text-fg shadow-overlay backdrop:bg-neutral-950/45',
		sizes[size],
		klass
	]}
>
	<div class="flex items-start gap-4 p-5 pb-3">
		<div class="flex-1 space-y-1">
			<h2 id="{id}-title" class="text-h2">{title}</h2>
			{#if description}
				<p id="{id}-description" class="text-sm text-fg-muted">{description}</p>
			{/if}
		</div>
		{#if dismissible}
			<button
				type="button"
				aria-label={closeLabel}
				onclick={() => (open = false)}
				class="-m-1 rounded-md p-1 text-fg-muted transition-colors duration-150 ease-out hover:bg-neutral-subtle hover:text-fg"
			>
				<X class="size-4.5" aria-hidden="true" />
			</button>
		{/if}
	</div>
	{#if children}
		<div class="px-5 pb-5">{@render children()}</div>
	{/if}
	{#if footer}
		<div class="flex justify-end gap-2 border-t border-line-subtle bg-surface-sunken px-5 py-3">
			{@render footer()}
		</div>
	{/if}
</dialog>
