<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X, Plus } from '@lucide/svelte';

	interface Props {
		/** Rotating palette slot, 1–8. */
		color?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
		/** Dashed outline style — for an "add tag" affordance. */
		outline?: boolean;
		/** Show a remove (×) button; fires `onremove`. */
		removable?: boolean;
		onremove?: () => void;
		children: Snippet;
		class?: string;
		[key: string]: unknown;
	}
	let {
		color = 1,
		outline = false,
		removable = false,
		onremove,
		children,
		class: className = '',
		...rest
	}: Props = $props();

	// Static class strings so Tailwind keeps them at build time.
	const palette: Record<number, string> = {
		1: 'bg-tag-1-subtle text-tag-1',
		2: 'bg-tag-2-subtle text-tag-2',
		3: 'bg-tag-3-subtle text-tag-3',
		4: 'bg-tag-4-subtle text-tag-4',
		5: 'bg-tag-5-subtle text-tag-5',
		6: 'bg-tag-6-subtle text-tag-6',
		7: 'bg-tag-7-subtle text-tag-7',
		8: 'bg-tag-8-subtle text-tag-8'
	};
	const base = 'inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold';
</script>

{#if outline}
	<button
		type="button"
		class="{base} border border-dashed border-border-strong px-2.5 py-1 text-text-muted transition hover:border-primary hover:text-primary {className}"
		{...rest}
	>
		<Plus size={13} />
		{@render children()}
	</button>
{:else}
	<span class="{base} {palette[color]} {removable ? 'py-1 pr-2 pl-2.5' : 'px-2.5 py-1'} {className}">
		{@render children()}
		{#if removable}
			<button
				type="button"
				aria-label="Remove"
				onclick={onremove}
				class="rounded opacity-70 transition hover:opacity-100"
			>
				<X size={13} />
			</button>
		{/if}
	</span>
{/if}
