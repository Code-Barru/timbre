<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

	interface Props {
		variant?: Variant;
		/** Solid fill + mono digits — for counts (9, 99+). */
		solid?: boolean;
		/** Leading status dot. */
		dot?: boolean;
		children: Snippet;
		class?: string;
	}
	let {
		variant = 'neutral',
		solid = false,
		dot = false,
		children,
		class: className = ''
	}: Props = $props();

	const soft: Record<Variant, string> = {
		neutral: 'bg-chip text-text-muted',
		primary: 'bg-primary-subtle text-primary',
		success: 'bg-success-subtle text-success',
		warning: 'bg-warning-subtle text-warning',
		danger: 'bg-danger-subtle text-danger',
		info: 'bg-info-subtle text-info'
	};
	const filled: Record<Variant, string> = {
		neutral: 'bg-neutral-600 text-white',
		primary: 'bg-primary text-text-inverse',
		success: 'bg-success text-text-inverse',
		warning: 'bg-warning text-text-inverse',
		danger: 'bg-danger text-text-inverse',
		info: 'bg-info text-text-inverse'
	};
	const dotColor: Record<Variant, string> = {
		neutral: 'bg-neutral-500',
		primary: 'bg-primary',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger',
		info: 'bg-info'
	};
</script>

<span
	class="inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold {solid
		? `min-w-[22px] px-1.5 py-0.5 font-mono ${filled[variant]}`
		: `px-2.5 py-1 ${soft[variant]}`} {className}"
>
	{#if dot}<span class="h-[7px] w-[7px] flex-none rounded-full {dotColor[variant]}"></span>{/if}
	{@render children()}
</span>
