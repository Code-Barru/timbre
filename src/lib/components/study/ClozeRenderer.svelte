<script lang="ts">
	import { Lightbulb } from '@lucide/svelte';

	interface Props {
		before: string;
		after: string;
		answer?: string;
		revealed?: boolean;
		/** Base-form / lemma hint shown while unrevealed. */
		hint?: string;
		ipa?: string;
		gloss?: string;
		class?: string;
	}
	let {
		before,
		after,
		answer,
		revealed = $bindable(false),
		hint,
		ipa,
		gloss,
		class: className = ''
	}: Props = $props();
</script>

<div class={className}>
	<div class="text-[22px] leading-relaxed font-medium text-text">
		{before}{#if revealed}<span
				class="rounded-md bg-success-subtle px-2.5 py-0.5 font-bold text-success">{answer}</span
			>{:else}<span
				class="inline-flex min-w-[78px] items-center justify-center rounded-t-md border-b-2 border-primary bg-primary-subtle px-3 py-0.5 font-bold text-primary"
				>?</span
			>{/if}{after}
	</div>

	{#if revealed}
		{#if ipa || gloss}
			<div class="mt-2 font-ipa text-base text-text-muted">
				{#if ipa}<span class="font-ipa">{ipa}</span>{/if}{#if ipa && gloss}
					—
				{/if}{#if gloss}<span class="font-sans">{gloss}</span>{/if}
			</div>
		{/if}
	{:else if hint}
		<div
			class="mt-3.5 inline-flex items-center gap-1.5 rounded-md bg-primary-subtle px-2.5 py-1.5 text-caption font-semibold text-primary"
		>
			<Lightbulb size={13} />
			base form: {hint}
		</div>
	{/if}
</div>
