<script lang="ts">
	interface Props {
		chars: string[];
		oninsert: (ch: string) => void;
		onbackspace?: () => void;
		class?: string;
	}
	let { chars, oninsert, onbackspace, class: className = '' }: Props = $props();

	const keyCap =
		'inline-flex h-11 min-w-[42px] cursor-pointer items-center justify-center rounded-lg border border-border border-b-2 transition active:border-b';
</script>

<div class="flex flex-wrap gap-2 {className}">
	{#each chars as ch (ch)}
		<button
			type="button"
			aria-label={`Insert ${ch}`}
			onclick={() => oninsert(ch)}
			class="{keyCap} bg-surface-sunken text-xl font-medium text-text hover:bg-surface-raised"
		>
			{ch}
		</button>
	{/each}
	{#if onbackspace}
		<button
			type="button"
			aria-label="Backspace"
			onclick={() => onbackspace?.()}
			class="{keyCap} bg-primary-subtle text-caption font-semibold text-primary hover:bg-primary-subtle/70"
		>
			ABC
		</button>
	{/if}
</div>
