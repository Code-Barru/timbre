<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Tab {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		tabs: Tab[];
		value?: string;
		variant?: 'line' | 'solid';
		label?: string;
		children?: Snippet;
		class?: string;
	}

	let {
		tabs,
		value = $bindable(tabs[0]?.value ?? ''),
		variant = 'line',
		label,
		children,
		class: klass
	}: Props = $props();

	const id = $props.id();

	let list = $state<HTMLElement | null>(null);

	function focusTab(index: number) {
		const enabled = tabs.filter((tab) => !tab.disabled);
		if (enabled.length === 0) return;
		const next = enabled[(index + enabled.length) % enabled.length];
		value = next.value;
		list?.querySelector<HTMLElement>(`[data-value="${next.value}"]`)?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		const enabled = tabs.filter((tab) => !tab.disabled);
		const index = enabled.findIndex((tab) => tab.value === value);
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			focusTab(index + 1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			focusTab(index - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			focusTab(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			focusTab(enabled.length - 1);
		}
	}
</script>

<div class={['flex flex-col gap-4', klass]}>
	<div
		bind:this={list}
		role="tablist"
		aria-label={label}
		class={[
			'flex items-center',
			variant === 'line'
				? 'gap-1 border-b border-line-subtle'
				: 'gap-1 rounded-md bg-surface-sunken p-1'
		]}
	>
		{#each tabs as tab (tab.value)}
			<button
				type="button"
				role="tab"
				data-value={tab.value}
				id="{id}-{tab.value}-tab"
				aria-controls="{id}-{tab.value}-panel"
				aria-selected={value === tab.value}
				tabindex={value === tab.value ? 0 : -1}
				disabled={tab.disabled}
				onclick={() => (value = tab.value)}
				onkeydown={onKeydown}
				class={[
					'px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50',
					variant === 'line'
						? value === tab.value
							? '-mb-px border-b-2 border-brand-solid text-fg'
							: '-mb-px border-b-2 border-transparent text-fg-muted hover:text-fg'
						: value === tab.value
							? 'rounded-sm bg-surface-raised text-fg shadow-popover'
							: 'rounded-sm text-fg-muted hover:text-fg'
				]}
			>
				{tab.label}
			</button>
		{/each}
	</div>
	{#if children}
		<div
			role="tabpanel"
			id="{id}-{value}-panel"
			aria-labelledby="{id}-{value}-tab"
			tabindex="0"
			class="outline-none"
		>
			{@render children()}
		</div>
	{/if}
</div>
