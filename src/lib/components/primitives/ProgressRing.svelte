<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

	interface Props {
		value?: number;
		size?: number;
		stroke?: number;
		tone?: Tone;
		/** Show the percentage in the middle. Ignored if `children` is set. */
		showValue?: boolean;
		children?: Snippet;
		class?: string;
	}
	let {
		value = 0,
		size = 76,
		stroke = 8,
		tone = 'primary',
		showValue = true,
		children,
		class: className = ''
	}: Props = $props();

	const tones: Record<Tone, string> = {
		primary: 'stroke-primary',
		success: 'stroke-success',
		warning: 'stroke-warning',
		danger: 'stroke-danger',
		info: 'stroke-info'
	};
	let pct = $derived(Math.max(0, Math.min(100, value)));
	let r = $derived((size - stroke) / 2);
	let circ = $derived(2 * Math.PI * r);
	let offset = $derived(circ * (1 - pct / 100));
</script>

<div class="relative inline-flex {className}" style="width:{size}px;height:{size}px">
	<svg width={size} height={size} viewBox="0 0 {size} {size}" class="-rotate-90">
		<circle cx={size / 2} cy={size / 2} {r} fill="none" stroke-width={stroke} class="stroke-border" />
		<circle
			cx={size / 2}
			cy={size / 2}
			{r}
			fill="none"
			stroke-width={stroke}
			stroke-linecap="round"
			stroke-dasharray={circ}
			stroke-dashoffset={offset}
			class="transition-[stroke-dashoffset] {tones[tone]}"
		/>
	</svg>
	<div class="absolute inset-0 flex items-center justify-center">
		{#if children}
			{@render children()}
		{:else if showValue}
			<span class="font-mono text-base font-bold text-text">{Math.round(pct)}%</span>
		{/if}
	</div>
</div>
