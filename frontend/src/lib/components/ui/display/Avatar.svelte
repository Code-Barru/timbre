<script lang="ts">
	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface Props {
		src?: string;
		name?: string;
		size?: Size;
		shape?: 'circle' | 'square';
		class?: string;
	}

	let { src, name = '', size = 'md', shape = 'circle', class: klass }: Props = $props();

	const sizes: Record<Size, string> = {
		xs: 'size-6 text-[0.625rem]',
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-xl'
	};

	const initials = $derived(
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
	);
</script>

<span
	class={[
		'inline-flex shrink-0 items-center justify-center overflow-hidden bg-brand-subtle font-semibold text-brand-fg select-none',
		shape === 'circle' ? 'rounded-full' : 'rounded-md',
		sizes[size],
		klass
	]}
>
	{#if src}
		<img {src} alt={name} class="size-full object-cover" />
	{:else}
		<span aria-hidden={name ? undefined : 'true'}>{initials}</span>
	{/if}
</span>
