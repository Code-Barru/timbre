<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		class?: string;
	}
	let {
		value = $bindable(0),
		min = -Infinity,
		max = Infinity,
		step = 1,
		disabled = false,
		class: className = ''
	}: Props = $props();

	function bump(dir: 1 | -1) {
		const next = value + dir * step;
		value = Math.max(min, Math.min(max, next));
	}
	let atMin = $derived(value <= min);
	let atMax = $derived(value >= max);
	const btn =
		'flex h-10 w-10 flex-none items-center justify-center bg-surface-sunken text-text transition hover:bg-chip disabled:cursor-not-allowed disabled:opacity-40';
</script>

<div
	class="inline-flex items-center overflow-hidden rounded border border-border-strong {disabled
		? 'opacity-50'
		: ''} {className}"
>
	<button
		type="button"
		aria-label="Decrease"
		onclick={() => bump(-1)}
		disabled={disabled || atMin}
		class={btn}
	>
		<Minus size={16} />
	</button>
	<span class="w-14 text-center font-mono text-[15px] font-semibold text-text">{value}</span>
	<button
		type="button"
		aria-label="Increase"
		onclick={() => bump(1)}
		disabled={disabled || atMax}
		class={btn}
	>
		<Plus size={16} />
	</button>
</div>
