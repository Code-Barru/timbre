<script lang="ts">
	type DeltaTone = 'success' | 'danger';
	type SparkTone = 'primary' | 'success' | 'neutral';

	interface Props {
		label: string;
		value: string | number;
		delta?: string;
		deltaTone?: DeltaTone;
		/** Bar heights as percentages (0–100). */
		spark?: number[];
		sparkTone?: SparkTone;
		class?: string;
	}
	let {
		label,
		value,
		delta,
		deltaTone = 'success',
		spark,
		sparkTone = 'primary',
		class: className = ''
	}: Props = $props();

	const deltaTones: Record<DeltaTone, string> = {
		success: 'text-success',
		danger: 'text-danger'
	};
	const sparkTones: Record<SparkTone, string> = {
		primary: 'bg-violet-300',
		success: 'bg-green-300',
		neutral: 'bg-neutral-400'
	};
</script>

<div class="rounded-xl border border-border p-4 {className}">
	<div class="text-label font-semibold uppercase text-text-faint">{label}</div>
	<div class="mt-1.5 flex items-baseline gap-1.5">
		<span class="text-[26px] font-extrabold leading-none text-text">{value}</span>
		{#if delta}
			<span class="text-xs font-semibold {deltaTones[deltaTone]}">{delta}</span>
		{/if}
	</div>
	{#if spark && spark.length}
		<div class="mt-3 flex h-[30px] items-end gap-[3px]">
			{#each spark as h, i (i)}
				<div class="flex-1 rounded-sm {sparkTones[sparkTone]}" style="height:{h}%"></div>
			{/each}
		</div>
	{/if}
</div>
