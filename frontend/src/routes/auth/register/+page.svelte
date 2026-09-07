<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ApiError } from '$api/errors';
	import { Button } from '$lib/components/ui/buttons';
	import { Alert } from '$lib/components/ui/feedback';
	import { Field, Form, Input } from '$lib/components/ui/forms';
	import { register } from '$lib/state/auth.svelte';

	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let submitting = $state(false);
	let formError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		submitting = true;
		formError = null;
		fieldErrors = {};

		try {
			await register({
				email,
				displayName,
				password,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
			});
			await goto(resolve('/'));
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

<svelte:head><title>Create account · Timbre</title></svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-1">
		<h1 class="text-xl font-semibold text-fg">Create account</h1>
		<p class="text-sm text-fg-muted">Start studying with Timbre.</p>
	</header>

	{#if formError}
		<Alert tone="danger">{formError}</Alert>
	{/if}

	<Form {onsubmit}>
		<Field label="Email" required error={fieldErrors.email?.[0]}>
			<Input bind:value={email} type="email" autocomplete="email" autofocus />
		</Field>

		<Field label="Display name" required error={fieldErrors.displayName?.[0]}>
			<Input bind:value={displayName} autocomplete="nickname" maxlength={25} />
		</Field>

		<Field
			label="Password"
			required
			hint="At least 8 characters, with one lowercase, one uppercase and one digit."
			error={fieldErrors.password?.[0]}
		>
			<Input bind:value={password} type="password" autocomplete="new-password" />
		</Field>

		<Button type="submit" loading={submitting} fullWidth>Create account</Button>
	</Form>

	<p class="text-center text-sm text-fg-muted">
		Already have an account?
		<Button href={resolve('/auth/login')} variant="link" size="sm">Sign in</Button>
	</p>
</div>
