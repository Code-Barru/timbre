<script lang="ts">
	import type { Snippet } from 'svelte';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import X from '@lucide/svelte/icons/x';

	type Tone = 'brand' | 'danger' | 'warning' | 'success';

	interface Props {
		tone?: Tone;
		title?: string;
		dismissible?: boolean;
		dismissLabel?: string;
		ondismiss?: () => void;
		icon?: Snippet;
		action?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		tone = 'brand',
		title,
		dismissible = false,
		dismissLabel = 'Dismiss',
		ondismiss,
		icon,
		action,
		children,
		class: klass
	}: Props = $props();

	const tones: Record<Tone, string> = {
		brand: 'border-brand-line bg-brand-subtle text-brand-fg',
		danger: 'border-danger-line bg-danger-subtle text-danger-fg',
		warning: 'border-warning-line bg-warning-subtle text-warning-fg',
		success: 'border-success-line bg-success-subtle text-success-fg'
	};

	const icons = {
		brand: Info,
		danger: CircleAlert,
		warning: TriangleAlert,
		success: CircleCheck
	};

	const ToneIcon = $derived(icons[tone]);
</script>

<div
	role={tone === 'danger' ? 'alert' : 'status'}
	class={['flex items-start gap-3 rounded-md border p-3', tones[tone], klass]}
>
	<span class="mt-0.5 shrink-0">
		{#if icon}
			{@render icon()}
		{:else}
			<ToneIcon class="size-4.5" aria-hidden="true" />
		{/if}
	</span>
	<div class="flex-1 space-y-1">
		{#if title}
			<p class="text-sm font-semibold">{title}</p>
		{/if}
		{#if children}
			<div class="text-sm text-fg-secondary">{@render children()}</div>
		{/if}
		{#if action}
			<div class="pt-1">{@render action()}</div>
		{/if}
	</div>
	{#if dismissible}
		<button
			type="button"
			aria-label={dismissLabel}
			onclick={ondismiss}
			class="-m-1 shrink-0 rounded-xs p-1 opacity-70 transition-opacity duration-150 ease-out hover:opacity-100"
		>
			<X class="size-4" aria-hidden="true" />
		</button>
	{/if}
</div>
