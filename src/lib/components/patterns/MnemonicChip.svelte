<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Sparkles } from '@lucide/svelte';

	type Tone = 'f' | 'm' | 'primary';

	interface Props {
		tone?: Tone;
		icon?: Snippet;
		children: Snippet;
		class?: string;
	}
	let { tone = 'primary', icon, children, class: className = '' }: Props = $props();

	const tones: Record<Tone, { bg: string; border: string; badge: string }> = {
		f: { bg: 'bg-gender-f-subtle', border: 'border-gender-f-subtle', badge: 'bg-gender-f' },
		m: { bg: 'bg-gender-m-subtle', border: 'border-gender-m-subtle', badge: 'bg-gender-m' },
		primary: { bg: 'bg-primary-subtle', border: 'border-primary-subtle', badge: 'bg-primary' }
	};
	let t = $derived(tones[tone]);
</script>

<span
	class="inline-flex w-fit items-center gap-2.5 rounded-md border px-3 py-2.5 {t.bg} {t.border} {className}"
>
	<span
		class="inline-flex h-6 w-6 flex-none items-center justify-center rounded-md text-text-inverse {t.badge}"
	>
		{#if icon}{@render icon()}{:else}<Sparkles size={14} />{/if}
	</span>
	<span class="text-caption font-medium text-text">{@render children()}</span>
</span>
