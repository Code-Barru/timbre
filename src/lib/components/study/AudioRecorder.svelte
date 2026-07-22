<script lang="ts">
	import { Play, Mic } from '@lucide/svelte';
	import IconButton from '$lib/components/primitives/IconButton.svelte';
	import Button from '$lib/components/primitives/Button.svelte';
	import SegmentedControl from '$lib/components/patterns/SegmentedControl.svelte';

	type State = 'idle' | 'recording' | 'recorded';

	interface Props {
		onrecorded?: (blob: Blob) => void;
		class?: string;
	}
	let { onrecorded, class: className = '' }: Props = $props();

	let mode = $state<State>('idle');
	let elapsed = $state(0); // seconds
	let track = $state('reference');

	// Decorative waveforms — fixed bar heights.
	const waveRef = [
		6, 11, 17, 23, 18, 12, 25, 29, 21, 14, 9, 17, 23, 27, 19, 12, 8, 15, 21, 25, 16, 10
	];
	const waveYou = [
		8, 13, 19, 17, 12, 22, 27, 24, 16, 10, 14, 20, 26, 22, 15, 9, 12, 18, 24, 19, 11, 7
	];
	const waveLive = [
		10, 18, 26, 34, 28, 20, 32, 38, 30, 22, 14, 24, 33, 37, 29, 18, 12, 20, 28, 36, 26, 16, 10, 22
	];

	let mediaRecorder: MediaRecorder | null = null;
	let stream: MediaStream | null = null;
	let chunks: Blob[] = [];
	let timer: ReturnType<typeof setInterval> | null = null;

	function fmt(s: number): string {
		const m = Math.floor(s / 60);
		const sec = Math.floor(s % 60);
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}

	function startTimer() {
		elapsed = 0;
		timer = setInterval(() => (elapsed += 1), 1000);
	}
	function stopTimer() {
		if (timer) clearInterval(timer);
		timer = null;
	}
	function releaseStream() {
		if (stream) {
			stream.getTracks().forEach((t) => t.stop());
			stream = null;
		}
	}

	async function startRecording() {
		mode = 'recording';
		startTimer();
		try {
			if (navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined') {
				stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				chunks = [];
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.ondataavailable = (e) => {
					if (e.data.size > 0) chunks.push(e.data);
				};
				mediaRecorder.onstop = () => {
					const blob = new Blob(chunks, { type: mediaRecorder?.mimeType || 'audio/webm' });
					onrecorded?.(blob);
					releaseStream();
				};
				mediaRecorder.start();
			}
		} catch {
			// Permission denied / unsupported — stay in demo mode.
		}
	}

	function stopRecording() {
		stopTimer();
		try {
			if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
			else releaseStream();
		} catch {
			releaseStream();
		}
		mediaRecorder = null;
		mode = 'recorded';
		track = 'reference';
	}

	function reRecord() {
		stopTimer();
		releaseStream();
		mode = 'idle';
	}

	$effect(() => {
		return () => {
			stopTimer();
			releaseStream();
		};
	});
</script>

<div class={className}>
	{#if mode === 'idle'}
		<div class="rounded-lg border border-border p-4.5">
			<!-- reference mini-player -->
			<div class="flex items-center gap-3">
				<IconButton
					label="Play reference"
					variant="ghost"
					size="md"
					class="rounded-full bg-primary-subtle text-primary hover:bg-primary-subtle"
				>
					<Play size={16} />
				</IconButton>
				<div class="flex h-8 flex-1 items-center gap-[3px]">
					{#each waveRef as h, i (i)}
						<div class="w-[3px] flex-none rounded-sm bg-violet-300" style="height:{h}px"></div>
					{/each}
				</div>
				<span class="font-mono text-xs text-text-faint">0:03</span>
				<span
					class="rounded-sm bg-primary-subtle px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-primary"
					>REF</span
				>
			</div>
			<!-- record button -->
			<div class="mt-4.5 flex flex-col items-center gap-2.5">
				<button
					type="button"
					aria-label="Tap to record"
					onclick={startRecording}
					class="inline-flex h-15 w-15 items-center justify-center rounded-full bg-danger text-white shadow-lg"
					style="width:60px;height:60px"
				>
					<Mic size={24} />
				</button>
				<span class="text-caption font-semibold text-text">Tap to record</span>
			</div>
		</div>
	{:else if mode === 'recording'}
		<div class="rounded-lg border border-danger-subtle bg-danger-subtle p-4.5">
			<div class="flex items-center gap-2.5">
				<span class="h-[11px] w-[11px] flex-none animate-rec-pulse rounded-full bg-danger"></span>
				<span class="text-caption font-bold text-danger">Recording</span>
				<span class="ml-auto font-mono text-caption font-medium text-danger">{fmt(elapsed)}</span>
			</div>
			<div class="mt-3.5 flex h-[38px] items-center gap-[3px]">
				{#each waveLive as h, i (i)}
					<div class="w-[3px] flex-none rounded-sm bg-danger" style="height:{h}px"></div>
				{/each}
			</div>
			<div class="mt-4 flex justify-center">
				<button
					type="button"
					onclick={stopRecording}
					class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-danger px-5 py-2.5 text-caption font-semibold text-white"
				>
					<span class="h-3 w-3 rounded-sm bg-white"></span>
					Stop
				</button>
			</div>
		</div>
	{:else}
		<div class="rounded-lg border border-border p-4.5">
			<div class="mb-4">
				<SegmentedControl
					bind:value={track}
					shape="pill"
					size="sm"
					options={[
						{ value: 'reference', label: 'Reference' },
						{ value: 'you', label: 'You' }
					]}
				/>
			</div>

			<!-- Reference row -->
			<div class="flex items-center gap-3 py-2.5">
				<IconButton
					label="Play reference"
					variant="ghost"
					size="sm"
					class="rounded-full bg-primary-subtle text-primary hover:bg-primary-subtle"
				>
					<Play size={15} />
				</IconButton>
				<span class="w-16 flex-none text-caption font-semibold text-text-muted">Reference</span>
				<div class="flex h-7 flex-1 items-center gap-[3px]">
					{#each waveRef as h, i (i)}
						<div class="w-[3px] flex-none rounded-sm bg-violet-300" style="height:{h}px"></div>
					{/each}
				</div>
				<span class="font-mono text-xs text-text-faint">0:03</span>
			</div>

			<!-- You row -->
			<div class="flex items-center gap-3 border-t border-border py-2.5">
				<IconButton label="Play your recording" variant="primary" size="sm" class="rounded-full">
					<Play size={15} />
				</IconButton>
				<span class="w-16 flex-none text-caption font-semibold text-text">You</span>
				<div class="flex h-7 flex-1 items-center gap-[3px]">
					{#each waveYou as h, i (i)}
						<div class="w-[3px] flex-none rounded-sm bg-primary" style="height:{h}px"></div>
					{/each}
				</div>
				<span class="font-mono text-xs text-text-faint">0:03</span>
			</div>

			<div class="mt-3.5 flex items-center gap-2.5">
				<Button variant="secondary" size="sm" onclick={reRecord}>
					<Mic size={14} class="text-danger" />
					Re-record
				</Button>
			</div>
		</div>
	{/if}
</div>
