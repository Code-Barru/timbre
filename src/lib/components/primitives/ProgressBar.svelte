<script lang="ts">
	type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

	interface Props {
		value?: number;
		max?: number;
		indeterminate?: boolean;
		tone?: Tone;
		class?: string;
	}
	let {
		value = 0,
		max = 100,
		indeterminate = false,
		tone = 'primary',
		class: className = ''
	}: Props = $props();

	const tones: Record<Tone, string> = {
		primary: 'bg-primary',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger',
		info: 'bg-info'
	};
	let pct = $derived(Math.max(0, Math.min(100, (value / max) * 100)));
</script>

<div
	class="h-2 overflow-hidden rounded-full bg-border {className}"
	role="progressbar"
	aria-valuenow={indeterminate ? undefined : value}
	aria-valuemax={max}
>
	{#if indeterminate}
		<div class="h-full w-1/4 animate-bar-slide rounded-full {tones[tone]}"></div>
	{:else}
		<div class="h-full rounded-full transition-[width] {tones[tone]}" style="width:{pct}%"></div>
	{/if}
</div>
