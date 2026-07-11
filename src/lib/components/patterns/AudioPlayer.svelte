<script lang="ts">
	import { Play, Pause } from '@lucide/svelte';
	import IconButton from '$lib/components/primitives/IconButton.svelte';

	interface Props {
		src?: string;
		class?: string;
	}
	let { src, class: className = '' }: Props = $props();

	let audio = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let rate = $state(1);

	const rates = [1, 1.25, 1.5];

	let disabled = $derived(!src);
	let pct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	function fmt(s: number): string {
		if (!isFinite(s) || s < 0) s = 0;
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60);
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}

	function toggle() {
		if (!audio) return;
		if (playing) {
			audio.pause();
		} else {
			void audio.play();
		}
	}

	function cycleRate() {
		const next = rates[(rates.indexOf(rate) + 1) % rates.length];
		rate = next;
		if (audio) audio.playbackRate = next;
	}

	function seek(e: MouseEvent) {
		if (!audio || !duration) return;
		const track = e.currentTarget as HTMLElement;
		const box = track.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
		audio.currentTime = ratio * duration;
	}
</script>

{#if src}
	<audio
		bind:this={audio}
		{src}
		preload="metadata"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		onended={() => (playing = false)}
		ontimeupdate={() => audio && (currentTime = audio.currentTime)}
		onloadedmetadata={() => audio && (duration = audio.duration)}
	></audio>
{/if}

<div class="flex items-center gap-3.5 {className}">
	<IconButton
		label={playing ? 'Pause' : 'Play'}
		variant="primary"
		class="rounded-full"
		onclick={toggle}
		disabled={disabled}
	>
		{#if playing}<Pause size={18} />{:else}<Play size={18} />{/if}
	</IconButton>

	<div class="flex-1">
		<button
			type="button"
			class="relative block h-1.5 w-full rounded-full bg-border {disabled
				? 'cursor-default'
				: 'cursor-pointer'}"
			aria-label="Seek"
			onclick={seek}
			disabled={disabled}
		>
			<span
				class="absolute left-0 top-0 h-1.5 rounded-full bg-primary"
				style="width:{pct}%"
			></span>
			<span
				class="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-surface"
				style="left:{pct}%"
			></span>
		</button>
	</div>

	<span class="flex-none font-mono text-xs font-medium text-text-muted">
		{fmt(currentTime)} / {fmt(duration)}
	</span>

	<button
		type="button"
		class="flex-none rounded-sm bg-primary-subtle px-2 py-1 font-mono text-[11px] font-semibold text-primary {disabled
			? 'cursor-default opacity-60'
			: 'cursor-pointer'}"
		onclick={cycleRate}
		disabled={disabled}
	>
		{rate}×
	</button>
</div>
