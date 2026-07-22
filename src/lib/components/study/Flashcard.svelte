<script lang="ts">
	import { Play, Tag as TagIcon } from '@lucide/svelte';
	import GenderBadge from '$lib/components/patterns/GenderBadge.svelte';
	import MnemonicChip from '$lib/components/patterns/MnemonicChip.svelte';
	import Tag from '$lib/components/primitives/Tag.svelte';
	import IconButton from '$lib/components/primitives/IconButton.svelte';
	import AudioPlayer from '$lib/components/patterns/AudioPlayer.svelte';

	type Gender = 'm' | 'f' | 'n';

	interface Props {
		word: string;
		ipa?: string;
		/** Meaning image URL. When absent, a hatched placeholder is shown. */
		image?: string;
		gender?: Gender;
		/** Grammatical-case tag, e.g. "biernik". */
		tag?: string;
		mnemonic?: string;
		personalNote?: string;
		/** Part of speech, e.g. "noun". */
		pos?: string;
		flipped?: boolean;
		audioSrc?: string;
		class?: string;
	}
	let {
		word,
		ipa,
		image,
		gender,
		tag,
		mnemonic,
		personalNote,
		pos,
		flipped = $bindable(false),
		audioSrc,
		class: className = ''
	}: Props = $props();

	// gender → MnemonicChip tone
	const mnemonicTone: Record<Gender, 'f' | 'm' | 'primary'> = {
		f: 'f',
		m: 'm',
		n: 'primary'
	};
	let chipTone = $derived(gender ? mnemonicTone[gender] : 'primary');

	const hatch = 'repeating-linear-gradient(45deg,#ECEAF2,#ECEAF2 8px,#F5F4F8 8px,#F5F4F8 16px)';

	function toggle() {
		flipped = !flipped;
	}
	function onkeydown(e: KeyboardEvent) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			toggle();
		}
	}
</script>

<div
	class="[perspective:1400px] {className}"
	style="width:300px;height:300px"
	role="button"
	tabindex="0"
	aria-pressed={flipped}
	onclick={toggle}
	{onkeydown}
>
	<div
		class="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
		style="transition:transform 320ms cubic-bezier(0.2,0,0,1);transform:rotateY({flipped
			? 180
			: 0}deg)"
	>
		<!-- FRONT -->
		<div
			class="absolute inset-0 flex flex-col rounded-lg border border-border bg-surface p-5 shadow-lg [backface-visibility:hidden]"
		>
			<div class="mb-3.5 flex items-center justify-between">
				{#if gender}
					<GenderBadge value={gender} variant="pill" />
				{:else}
					<span></span>
				{/if}
				{#if pos}
					<span class="text-caption font-semibold tracking-wider text-text-faint uppercase"
						>{pos}</span
					>
				{/if}
			</div>

			{#if image}
				<img src={image} alt="meaning" class="min-h-0 flex-1 rounded-md object-cover" />
			{:else}
				<div
					class="flex min-h-0 flex-1 items-center justify-center rounded-md"
					style="background:{hatch}"
				>
					<span
						class="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text-faint"
						>meaning image</span
					>
				</div>
			{/if}

			<div class="mt-4 text-center text-caption font-medium text-text-muted">
				Produce the word + pronunciation
			</div>
			<div class="mt-1.5 text-center text-caption font-medium text-text-faint">
				press
				<span class="rounded border border-border bg-surface-sunken px-1.5 py-px font-mono text-xs"
					>Space</span
				> to flip
			</div>
		</div>

		<!-- BACK -->
		<div
			class="absolute inset-0 flex flex-col rounded-lg border border-border bg-surface p-5 shadow-lg [backface-visibility:hidden]"
			style="transform:rotateY(180deg)"
		>
			<div class="flex items-center justify-between">
				{#if gender}
					<GenderBadge value={gender} variant="pill" />
				{:else}
					<span></span>
				{/if}
				{#if tag}
					<Tag color={1}>
						<TagIcon size={13} />
						{tag}
					</Tag>
				{/if}
			</div>

			<div class="mt-3.5 text-h1 font-bold tracking-tight text-text">{word}</div>

			{#if ipa}
				<div class="mt-1.5 flex items-center gap-2.5">
					<span class="font-ipa text-h4 text-text-muted">{ipa}</span>
					<IconButton
						label="Play pronunciation"
						variant="ghost"
						size="sm"
						class="rounded-full bg-primary-subtle text-primary hover:bg-primary-subtle"
					>
						<Play size={15} />
					</IconButton>
				</div>
			{/if}

			{#if audioSrc}
				<div class="mt-2.5">
					<AudioPlayer src={audioSrc} />
				</div>
			{/if}

			{#if image}
				<img src={image} alt="meaning" class="mt-3.5 h-[108px] rounded-md object-cover" />
			{:else}
				<div
					class="mt-3.5 flex h-[108px] items-center justify-center rounded-md"
					style="background:{hatch}"
				>
					<span
						class="rounded border border-border bg-surface px-2 py-0.5 font-mono text-xs text-text-faint"
						>meaning image</span
					>
				</div>
			{/if}

			{#if mnemonic}
				<div class="mt-3.5">
					<MnemonicChip tone={chipTone}>{mnemonic}</MnemonicChip>
				</div>
			{/if}

			{#if personalNote}
				<div class="mt-3 border-t border-dashed border-border pt-3">
					<div class="text-label text-text-faint uppercase">Personal connection</div>
					<div class="mt-1 text-caption leading-relaxed text-text-muted">{personalNote}</div>
				</div>
			{/if}
		</div>
	</div>
</div>
