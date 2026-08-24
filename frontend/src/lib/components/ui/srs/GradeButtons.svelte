<script lang="ts">
	import Kbd from '../display/Kbd.svelte';

	export type Grade = 1 | 2 | 3 | 4;

	interface Props {
		ongrade: (grade: Grade) => void;
		intervals?: [string, string, string, string];
		disabled?: boolean;
		size?: 'md' | 'lg';
		showShortcuts?: boolean;
		class?: string;
	}

	let {
		ongrade,
		intervals,
		disabled = false,
		size = 'md',
		showShortcuts = true,
		class: klass
	}: Props = $props();

	const grades = [
		{
			grade: 1 as Grade,
			label: 'Again',
			key: '1',
			tone: 'bg-danger-solid text-danger-on-solid hover:bg-danger-solid-hover'
		},
		{
			grade: 2 as Grade,
			label: 'Hard',
			key: '2',
			tone: 'bg-warning-solid text-warning-on-solid hover:bg-warning-solid-hover'
		},
		{
			grade: 3 as Grade,
			label: 'Good',
			key: '3',
			tone: 'bg-brand-solid text-brand-on-solid hover:bg-brand-solid-hover'
		},
		{
			grade: 4 as Grade,
			label: 'Easy',
			key: '4',
			tone: 'bg-success-solid text-success-on-solid hover:bg-success-solid-hover'
		}
	];

	const sizes = {
		md: 'h-14 text-sm',
		lg: 'h-16 text-base'
	};

	function onKeydown(event: KeyboardEvent) {
		if (disabled || event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

		const index = ['1', '2', '3', '4'].indexOf(event.key);
		if (index >= 0) {
			event.preventDefault();
			ongrade(grades[index].grade);
			return;
		}
		if (event.key === ' ') {
			event.preventDefault();
			ongrade(3);
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div class={['grid grid-cols-2 gap-2 sm:grid-cols-4', klass]}>
	{#each grades as item (item.grade)}
		<button
			type="button"
			{disabled}
			onclick={() => ongrade(item.grade)}
			class={[
				'flex flex-col items-center justify-center gap-1 rounded-md font-semibold transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50',
				item.tone,
				sizes[size]
			]}
		>
			<span>{item.label}</span>
			{#if intervals}
				<span class="text-xs font-normal tabular-nums opacity-80">
					{intervals[item.grade - 1]}
				</span>
			{/if}
			{#if showShortcuts}
				<Kbd keys={[item.key]} class="opacity-80" />
			{/if}
		</button>
	{/each}
</div>
