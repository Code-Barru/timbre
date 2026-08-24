<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'brand' | 'danger' | 'warning' | 'success';

	interface Props {
		value?: number;
		max?: number;
		size?: number;
		thickness?: number;
		tone?: Tone;
		label?: string;
		children?: Snippet;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		size = 72,
		thickness = 6,
		tone = 'brand',
		label,
		children,
		class: klass
	}: Props = $props();

	const tones: Record<Tone, string> = {
		brand: 'text-brand-solid',
		danger: 'text-danger-solid',
		warning: 'text-warning-solid',
		success: 'text-success-solid'
	};

	const radius = $derived((size - thickness) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const ratio = $derived(Math.min(1, Math.max(0, value / max)));
</script>

<div
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={value}
	class={['relative inline-flex items-center justify-center', klass]}
	style="width: {size}px; height: {size}px"
>
	<svg width={size} height={size} viewBox="0 0 {size} {size}" class="-rotate-90">
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--color-surface-sunken)"
			stroke-width={thickness}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="currentColor"
			class={['transition-[stroke-dashoffset] duration-500 ease-out', tones[tone]]}
			stroke-width={thickness}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={circumference * (1 - ratio)}
		/>
	</svg>
	{#if children}
		<span class="absolute inset-0 flex items-center justify-center">{@render children()}</span>
	{/if}
</div>
