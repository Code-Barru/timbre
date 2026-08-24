<script lang="ts">
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		word: string;
		ipa?: string;
		sentence?: string;
		lang?: string;
		size?: Size;
		align?: 'start' | 'center';
		class?: string;
	}

	let { word, ipa, sentence, lang, size = 'md', align = 'start', class: klass }: Props = $props();

	const words: Record<Size, string> = {
		sm: 'text-word',
		md: 'text-word',
		lg: 'text-word-lg'
	};

	const ipas: Record<Size, string> = {
		sm: 'text-sm',
		md: 'text-ipa',
		lg: 'text-ipa'
	};

	const gaps: Record<Size, string> = {
		sm: 'gap-0.5',
		md: 'gap-1',
		lg: 'gap-2'
	};
</script>

<div
	class={['flex flex-col font-lang', gaps[size], align === 'center' && 'items-center', klass]}
	{lang}
>
	<p class={['font-bold text-fg', words[size]]}>{word}</p>
	{#if ipa}
		<p class={['tracking-[0.02em] text-fg-muted', ipas[size]]}>{ipa}</p>
	{/if}
	{#if sentence}
		<p class="pt-1 text-sentence text-fg-secondary italic">{sentence}</p>
	{/if}
</div>
