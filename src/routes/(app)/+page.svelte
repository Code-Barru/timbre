<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/primitives';
	import { m } from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="flex flex-col items-center gap-4">
		<h1 class="text-h1 text-text">{m.home_greeting({ name: data.user.name })}</h1>
		<Button href={resolve('/sign-out')} variant="secondary">{m.sign_out_submit()}</Button>
	</div>
</div>
