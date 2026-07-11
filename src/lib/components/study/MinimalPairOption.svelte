<script lang="ts">
	import { Play, Check, X } from '@lucide/svelte';

	type State = 'default' | 'selected' | 'correct' | 'incorrect';

	interface Props {
		word: string;
		ipa?: string;
		state?: State;
		onclick?: () => void;
		audioSrc?: string;
		class?: string;
	}
	let {
		word,
		ipa,
		state = 'default',
		onclick,
		class: className = ''
	}: Props = $props();

	// Static class maps so Tailwind keeps them at build time.
	const tile: Record<State, string> = {
		default: 'border border-border-strong bg-surface',
		selected: 'border-2 border-primary bg-primary-subtle',
		correct: 'border-2 border-success bg-success-subtle',
		incorrect: 'border-2 border-danger bg-danger-subtle'
	};
	const circle: Record<State, string> = {
		default: 'bg-primary-subtle text-primary',
		selected: 'bg-primary text-white',
		correct: 'bg-success text-white',
		incorrect: 'bg-danger text-white'
	};
	const wordColor: Record<State, string> = {
		default: 'text-text',
		selected: 'text-text',
		correct: 'text-success',
		incorrect: 'text-danger'
	};
</script>

<button
	type="button"
	{onclick}
	class="flex w-full items-center gap-3 rounded-xl p-3.5 text-left {tile[state]} {className}"
>
	<span
		class="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full {circle[
			state
		]}"
	>
		{#if state === 'correct'}
			<Check size={16} />
		{:else if state === 'incorrect'}
			<X size={16} />
		{:else}
			<Play size={15} />
		{/if}
	</span>
	<div class="min-w-0">
		<div class="text-h4 font-semibold {wordColor[state]}">{word}</div>
		{#if ipa}
			<div class="font-ipa text-caption text-text-muted">{ipa}</div>
		{/if}
	</div>
</button>
