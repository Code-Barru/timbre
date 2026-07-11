<script lang="ts">
	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg';
		/** `primary` = violet track; `current` = inherits text color (for buttons). */
		tone?: 'primary' | 'current';
		label?: string;
		class?: string;
	}
	let { size = 'md', tone = 'primary', label = 'Loading', class: className = '' }: Props = $props();

	const dims = {
		xs: 'h-3.5 w-3.5 border-2',
		sm: 'h-[18px] w-[18px] border-2',
		md: 'h-[26px] w-[26px] border-[3px]',
		lg: 'h-[38px] w-[38px] border-[3px]'
	};
	const tones = {
		primary: 'border-border border-t-primary',
		current: 'border-current/25 border-t-current'
	};
</script>

<span
	class="inline-block animate-spin-fast rounded-full {dims[size]} {tones[tone]} {className}"
	role="status"
	aria-label={label}
></span>
