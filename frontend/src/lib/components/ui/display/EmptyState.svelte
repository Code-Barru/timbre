<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: Snippet;
		action?: Snippet;
		class?: string;
	}

	let { title, description, icon, action, class: klass }: Props = $props();
</script>

<div
	class={[
		'flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-subtle px-6 py-12 text-center',
		klass
	]}
>
	{#if icon}
		<span
			class="flex size-11 items-center justify-center rounded-full bg-brand-subtle text-brand-fg"
		>
			{@render icon()}
		</span>
	{/if}
	<div class="space-y-1">
		<p class="text-h3 text-fg">{title}</p>
		{#if description}
			<p class="max-w-sm text-sm text-fg-muted">{description}</p>
		{/if}
	</div>
	{#if action}
		<div class="pt-1">{@render action()}</div>
	{/if}
</div>
