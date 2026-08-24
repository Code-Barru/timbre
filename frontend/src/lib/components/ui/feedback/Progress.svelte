<script lang="ts">
	type Tone = 'brand' | 'danger' | 'warning' | 'success';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		value?: number;
		max?: number;
		indeterminate?: boolean;
		tone?: Tone;
		size?: Size;
		label?: string;
		class?: string;
	}

	let {
		value = 0,
		max = 100,
		indeterminate = false,
		tone = 'brand',
		size = 'md',
		label,
		class: klass
	}: Props = $props();

	const tones: Record<Tone, string> = {
		brand: 'bg-brand-solid',
		danger: 'bg-danger-solid',
		warning: 'bg-warning-solid',
		success: 'bg-success-solid'
	};

	const sizes: Record<Size, string> = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	};

	const percent = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div
	role="progressbar"
	aria-label={label}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={indeterminate ? undefined : value}
	class={['relative overflow-hidden rounded-full bg-surface-sunken', sizes[size], klass]}
>
	{#if indeterminate}
		<div
			class={[
				'absolute inset-y-0 w-1/3 animate-progress rounded-full motion-reduce:w-full motion-reduce:animate-none',
				tones[tone]
			]}
		></div>
	{:else}
		<div
			class={['h-full rounded-full transition-[width] duration-300 ease-out', tones[tone]]}
			style="width: {percent}%"
		></div>
	{/if}
</div>
