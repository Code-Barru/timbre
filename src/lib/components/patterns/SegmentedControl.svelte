<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}
	interface Props {
		value?: string;
		options: Option[];
		shape?: 'box' | 'pill';
		size?: 'sm' | 'md';
		class?: string;
	}
	let {
		value = $bindable(''),
		options,
		shape = 'box',
		size = 'md',
		class: className = ''
	}: Props = $props();

	let trackCls = $derived(
		shape === 'pill'
			? 'rounded-full p-[3px]'
			: 'rounded-md p-1'
	);
	let segShapeCls = $derived(shape === 'pill' ? 'rounded-full' : 'rounded');
	let sizeCls = $derived(
		size === 'sm' ? 'px-3 py-1.5 text-caption' : 'px-4 py-2 text-label'
	);

	function selectedCls(active: boolean): string {
		if (!active) return 'text-text-muted hover:text-text';
		return shape === 'pill' ? 'bg-primary text-text-inverse' : 'bg-surface text-text shadow-sm';
	}
</script>

<div
	role="tablist"
	class="inline-flex w-fit bg-chip {trackCls} {className}"
>
	{#each options as option (option.value)}
		<button
			type="button"
			role="tab"
			aria-selected={value === option.value}
			onclick={() => (value = option.value)}
			class="cursor-pointer font-semibold transition {segShapeCls} {sizeCls} {selectedCls(
				value === option.value
			)}"
		>
			{option.label}
		</button>
	{/each}
</div>
