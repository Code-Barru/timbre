<script lang="ts">
	type Value = 'm' | 'f' | 'n';
	type Variant = 'chip' | 'pill';

	interface Props {
		value: Value;
		variant?: Variant;
		class?: string;
	}
	let { value, variant = 'pill', class: className = '' }: Props = $props();

	const data: Record<
		Value,
		{ bg: string; text: string; dot: string; label: string; letter: string }
	> = {
		m: {
			bg: 'bg-gender-m-subtle',
			text: 'text-gender-m',
			dot: 'bg-gender-m',
			label: 'męski',
			letter: 'm'
		},
		f: {
			bg: 'bg-gender-f-subtle',
			text: 'text-gender-f',
			dot: 'bg-gender-f',
			label: 'żeński',
			letter: 'ż'
		},
		n: {
			bg: 'bg-gender-n-subtle',
			text: 'text-gender-n',
			dot: 'bg-gender-n',
			label: 'nijaki',
			letter: 'n'
		}
	};
	let d = $derived(data[value]);
</script>

{#if variant === 'chip'}
	<span
		class="inline-flex h-5.5 w-5.5 flex-none items-center justify-center rounded-md text-xs font-bold {d.bg} {d.text} {className}"
	>
		{d.letter}
	</span>
{:else}
	<span
		class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-bold {d.bg} {d.text} {className}"
	>
		<span class="h-[7px] w-[7px] flex-none rounded-full {d.dot}"></span>
		{d.letter} · {d.label}
	</span>
{/if}
