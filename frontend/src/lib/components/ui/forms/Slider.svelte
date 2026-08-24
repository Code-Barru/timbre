<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getFieldContext } from './field';

	type Tone = 'brand' | 'danger' | 'warning' | 'success';

	interface Mark {
		value: number;
		label: string;
	}

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'value' | 'min' | 'max' | 'step'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		marks?: Mark[];
		showValue?: boolean;
		formatValue?: (value: number) => string;
		tone?: Tone;
		class?: string;
	}

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		marks,
		showValue = false,
		formatValue = (current: number) => String(current),
		tone = 'brand',
		disabled = false,
		id,
		class: klass,
		...rest
	}: Props = $props();

	const field = getFieldContext();

	const tones: Record<Tone, string> = {
		brand: 'var(--color-brand-solid)',
		danger: 'var(--color-danger-solid)',
		warning: 'var(--color-warning-solid)',
		success: 'var(--color-success-solid)'
	};

	const sliderId = $derived(id ?? field?.id);
	const percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class={['flex flex-col gap-2', disabled && 'pointer-events-none opacity-50', klass]}>
	<div class="flex items-center gap-3">
		<input
			type="range"
			id={sliderId}
			bind:value
			{min}
			{max}
			{step}
			{disabled}
			aria-describedby={field?.describedBy}
			style="--fill: {percent}%; --tone: {tones[tone]}"
			{...rest}
		/>
		{#if showValue}
			<output for={sliderId} class="w-12 shrink-0 text-right text-sm text-fg tabular-nums">
				{formatValue(value)}
			</output>
		{/if}
	</div>
	{#if marks}
		<div class="relative h-4 text-xs text-fg-muted">
			{#each marks as mark (mark.value)}
				<span
					class="absolute -translate-x-1/2 whitespace-nowrap"
					style="left: {((mark.value - min) / (max - min)) * 100}%"
				>
					{mark.label}
				</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	input[type='range'] {
		appearance: none;
		-webkit-appearance: none;
		flex: 1;
		height: 6px;
		border-radius: var(--radius-full);
		background: linear-gradient(
			to right,
			var(--tone) 0 var(--fill),
			var(--color-surface-sunken) var(--fill) 100%
		);
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 1rem;
		height: 1rem;
		border-radius: var(--radius-full);
		background: var(--color-surface-raised);
		border: 2px solid var(--tone);
		transition: box-shadow 150ms ease-out;
	}

	input[type='range']::-moz-range-thumb {
		width: 1rem;
		height: 1rem;
		border-radius: var(--radius-full);
		background: var(--color-surface-raised);
		border: 2px solid var(--tone);
		transition: box-shadow 150ms ease-out;
	}

	input[type='range']:hover::-webkit-slider-thumb,
	input[type='range']:focus-visible::-webkit-slider-thumb {
		box-shadow: 0 0 0 4px color-mix(in oklch, var(--tone) 25%, transparent);
	}

	input[type='range']:hover::-moz-range-thumb,
	input[type='range']:focus-visible::-moz-range-thumb {
		box-shadow: 0 0 0 4px color-mix(in oklch, var(--tone) 25%, transparent);
	}
</style>
