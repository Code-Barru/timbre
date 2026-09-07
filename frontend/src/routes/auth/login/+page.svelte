<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ApiError } from '$api/errors';
	import { Button } from '$lib/components/ui/buttons';
	import { Alert } from '$lib/components/ui/feedback';
	import { Field, Form, Input } from '$lib/components/ui/forms';
	import { login, safeRedirectTarget } from '$lib/state/auth.svelte';

	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let formError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	const target = $derived(safeRedirectTarget(page.url.searchParams.get('redirectTo')));

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		submitting = true;
		formError = null;
		fieldErrors = {};

		try {
			await login({ email, password });
			await goto(target);
		} catch (err) {
			if (err instanceof ApiError) {
				formError = err.message;
				fieldErrors = err.fieldErrors ?? {};
			} else {
				formError = 'Unknown error';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head><title>Sign in · Timbre</title></svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-1">
		<h1 class="text-xl font-semibold text-fg">Sign in</h1>
		<p class="text-sm text-fg-muted">Welcome back to Timbre.</p>
	</header>

	{#if formError}
		<Alert tone="danger">{formError}</Alert>
	{/if}

	<Form {onsubmit}>
		<Field label="Email" required error={fieldErrors.email?.[0]}>
			<Input bind:value={email} type="email" autocomplete="email" autofocus />
		</Field>

		<Field label="Password" required error={fieldErrors.password?.[0]}>
			<Input bind:value={password} type="password" autocomplete="current-password" />
		</Field>

		<Button type="submit" loading={submitting} fullWidth>Sign in</Button>
	</Form>

	<p class="text-center text-sm text-fg-muted">
		No account yet?
		<Button href={resolve('/auth/register')} variant="link" size="sm">Create one</Button>
	</p>
</div>
