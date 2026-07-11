<script lang="ts">
	interface Props {
		circle?: boolean;
		/** Any sizing / radius utilities, e.g. "h-4 w-3/4". */
		class?: string;
	}
	let { circle = false, class: className = 'h-4 w-full' }: Props = $props();
</script>

<div
	class="animate-shimmer bg-[linear-gradient(90deg,var(--color-skeleton)_25%,var(--color-skeleton-hi)_37%,var(--color-skeleton)_63%)] bg-[length:200%_100%] {circle
		? 'rounded-full'
		: 'rounded-md'} {className}"
></div>
