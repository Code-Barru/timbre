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
		orientation?: 'horizontal' | 'vertical';
		label?: string;
		children?: Snippet;
		class?: string;
	}

	let {
		tabs,
		value = $bindable(tabs[0]?.value ?? ''),
		variant = 'line',
		orientation = 'horizontal',
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
		const [prevKey, nextKey] =
			orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
		if (event.key === nextKey) {
			event.preventDefault();
			focusTab(index + 1);
		} else if (event.key === prevKey) {
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

<div
	class={[
		orientation === 'vertical' ? 'flex flex-col gap-6 sm:flex-row' : 'flex flex-col gap-4',
		klass
	]}
>
	<div
		bind:this={list}
		role="tablist"
		aria-label={label}
		aria-orientation={orientation}
		class={[
			'flex gap-1',
			orientation === 'vertical' ? 'shrink-0 flex-col sm:w-48 sm:self-start' : 'items-center',
			variant === 'solid'
				? 'rounded-md bg-surface-sunken p-1'
				: orientation === 'vertical'
					? 'border-l border-line-subtle'
					: 'border-b border-line-subtle'
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
					'px-3 py-2 text-left text-sm font-medium transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50',
					variant === 'line'
						? [
								orientation === 'vertical' ? '-ml-px border-l-2' : '-mb-px border-b-2',
								value === tab.value
									? 'border-brand-solid text-fg'
									: 'border-transparent text-fg-muted hover:text-fg'
							]
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
			class={['outline-none', orientation === 'vertical' && 'min-w-0 flex-1']}
		>
			{@render children()}
		</div>
	{/if}
</div>
