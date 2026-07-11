<script lang="ts">
	import { Flame } from '@lucide/svelte';

	interface Props {
		days: number;
		/** 7 booleans — filled = studied that day. */
		week: boolean[];
		class?: string;
	}
	let { days, week, class: className = '' }: Props = $props();
</script>

<div class="flex items-center gap-4 {className}">
	<div class="inline-flex items-center gap-2.5">
		<span
			class="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-md bg-warning-subtle text-warning"
		>
			<Flame size={20} />
		</span>
		<div>
			<div class="text-xl font-extrabold leading-none text-text">{days}</div>
			<div class="mt-0.5 text-[11px] font-medium text-text-faint">day streak</div>
		</div>
	</div>
	<div class="ml-1.5 flex gap-1.5">
		{#each week as studied, i (i)}
			<span
				class="h-3.5 w-3.5 rounded-sm {studied ? 'bg-warning' : 'bg-chip'}"
			></span>
		{/each}
	</div>
</div>
