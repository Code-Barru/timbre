<script lang="ts">
	type Grade = 'again' | 'hard' | 'good' | 'easy';
	interface Intervals {
		again: string;
		hard: string;
		good: string;
		easy: string;
	}

	interface Props {
		intervals?: Intervals;
		hotkeys?: boolean;
		disabled?: boolean;
		ongrade: (g: Grade) => void;
		class?: string;
	}
	let {
		intervals = { again: '<1m', hard: '<10m', good: '1d', easy: '4d' },
		hotkeys = true,
		disabled = false,
		ongrade,
		class: className = ''
	}: Props = $props();

	// Static classes so Tailwind keeps them.
	const grades: { grade: Grade; label: string; bg: string; key: string }[] = [
		{ grade: 'again', label: 'Again', bg: 'bg-grade-again', key: '1' },
		{ grade: 'hard', label: 'Hard', bg: 'bg-grade-hard', key: '2' },
		{ grade: 'good', label: 'Good', bg: 'bg-grade-good', key: '3' },
		{ grade: 'easy', label: 'Easy', bg: 'bg-grade-easy', key: '4' }
	];

	const keyMap: Record<string, Grade> = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };

	function grade(g: Grade) {
		if (disabled) return;
		ongrade(g);
	}

	$effect(() => {
		if (!hotkeys) return;
		function onkeydown(e: KeyboardEvent) {
			if (disabled) return;
			const el = document.activeElement;
			if (el instanceof HTMLElement) {
				const tag = el.tagName;
				if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return;
			}
			const g = keyMap[e.key];
			if (g) {
				e.preventDefault();
				ongrade(g);
			}
		}
		window.addEventListener('keydown', onkeydown);
		return () => window.removeEventListener('keydown', onkeydown);
	});
</script>

<div class="flex gap-2 {className}">
	{#each grades as g (g.grade)}
		<button
			type="button"
			{disabled}
			onclick={() => grade(g.grade)}
			class="flex-1 cursor-pointer rounded-md px-2 py-3.5 text-center text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-45 {g.bg}"
		>
			<div class="text-base font-bold">{g.label}</div>
			<div class="mt-0.5 text-caption font-medium opacity-85">{intervals[g.grade]}</div>
			{#if hotkeys}
				<div
					class="mt-2 inline-block rounded-sm bg-white/20 px-1.5 py-0.5 font-mono text-xs font-semibold"
				>
					{g.key}
				</div>
			{/if}
		</button>
	{/each}
</div>
