<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import SegmentedControl from './SegmentedControl.svelte';

	type Locale = (typeof locales)[number];

	interface Props {
		class?: string;
	}
	let { class: className = '' }: Props = $props();

	let value = $state<string>(getLocale());
	let options = locales.map((locale) => ({ value: locale, label: locale.toUpperCase() }));

	$effect(() => {
		if (value !== getLocale()) setLocale(value as Locale);
	});
</script>

<SegmentedControl bind:value size="sm" class={className} {options} />
