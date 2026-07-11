<script lang="ts">
	import { Tag } from '$lib/components/primitives';

	type TagColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	interface Props {
		tags?: string[];
		placeholder?: string;
		/** Base palette slot; rotates through 1–8 across tags. */
		color?: TagColor;
		label?: string;
		help?: string;
		class?: string;
	}
	let {
		tags = $bindable<string[]>([]),
		placeholder = 'Add tag…',
		color = 1,
		label,
		help,
		class: className = ''
	}: Props = $props();

	let draft = $state('');

	function colorFor(index: number): TagColor {
		return (((color - 1 + index) % 8) + 1) as TagColor;
	}

	function addTag() {
		const trimmed = draft.trim();
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
		}
		draft = '';
	}

	function removeAt(index: number) {
		tags = tags.filter((_, i) => i !== index);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		} else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
			event.preventDefault();
			tags = tags.slice(0, -1);
		}
	}
</script>

<div class={className}>
	{#if label}
		<span class="mb-1.5 block text-label font-semibold text-text">{label}</span>
	{/if}
	<div
		class="flex flex-wrap items-center gap-2 rounded border border-border-strong bg-surface p-2 transition focus-within:border-primary"
	>
		{#each tags as tag, i (tag)}
			<Tag color={colorFor(i)} removable onremove={() => removeAt(i)}>{tag}</Tag>
		{/each}
		<input
			type="text"
			{placeholder}
			bind:value={draft}
			{onkeydown}
			class="flex-1 border-none bg-transparent p-1 text-sm text-text placeholder:text-text-faint focus:outline-none"
		/>
	</div>
	{#if help}
		<div class="mt-1.5 text-caption text-text-faint">{help}</div>
	{/if}
</div>
