<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { NavSection } from './nav';

	interface Props {
		title: string;
		sections: NavSection[];
		footer?: Snippet;
		class?: string;
	}

	let { title, sections, footer, class: klass }: Props = $props();

	function isActive(path: string) {
		const current = page.url.pathname;
		return current === path || current.startsWith(`${path}/`);
	}
</script>

<nav
	aria-label={title}
	class={[
		'flex h-full w-60 shrink-0 flex-col gap-6 border-r border-line-subtle bg-surface-raised px-3',
		klass
	]}
>
	<span class="px-2 pt-3 text-h3 text-fg">{title}</span>
	{#each sections as section, index (section.title ?? index)}
		<div class="flex flex-col gap-1">
			{#if section.title}
				<span class="border-b-surface-base px-2 text-eyebrow text-fg-muted uppercase"
					>{section.title}</span
				>
			{/if}
			{#each section.items as item (item.path)}
				{@const active = isActive(item.path)}
				{@const Icon = item.icon}
				<a
					href={resolve(item.path)}
					aria-current={active ? 'page' : undefined}
					class={[
						'flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm transition duration-150 ease-out',
						active
							? 'bg-brand-subtle font-medium text-brand-fg'
							: 'text-fg-secondary hover:bg-neutral-subtle hover:text-fg active:bg-neutral-subtle-hover'
					]}
				>
					<Icon size={18} class="shrink-0" />
					<span class="flex-1 truncate">{item.label}</span>
				</a>
			{/each}
		</div>
	{/each}

	<div class="mt-auto">
		{#if footer}{@render footer()}{/if}
	</div>
</nav>
