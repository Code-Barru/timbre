<script lang="ts">
	import { ApiError } from '$api/errors';
	import { Button } from '$lib/components/ui/buttons';
	import { Card } from '$lib/components/ui/display';
	import { Alert, toasts } from '$lib/components/ui/feedback';
	import { Field, Form, Input } from '$lib/components/ui/forms';
	import { changePassword } from '$lib/state/auth.svelte';

	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let submitting = $state(false);
	let formError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		formError = null;
		fieldErrors = {};

		if (newPassword !== confirmPassword) {
			fieldErrors = { confirmPassword: ['Passwords do not match'] };
			return;
		}

		submitting = true;

		try {
			await changePassword({ oldPassword, newPassword });
			oldPassword = '';
			newPassword = '';
			confirmPassword = '';
			toasts.push({ tone: 'success', title: 'Password changed' });
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

{#snippet header()}
	<h2 class="text-h3 text-fg">Password</h2>
{/snippet}

<Card {header}>
	<Form {onsubmit}>
		{#if formError}
			<Alert tone="danger">{formError}</Alert>
		{/if}

		<Field label="Current password" required error={fieldErrors.oldPassword?.[0]}>
			<Input bind:value={oldPassword} type="password" autocomplete="current-password" />
		</Field>

		<Field
			label="New password"
			required
			hint="At least 8 characters, with one lowercase, one uppercase and one digit."
			error={fieldErrors.newPassword?.[0]}
		>
			<Input bind:value={newPassword} type="password" autocomplete="new-password" />
		</Field>

		<Field label="Confirm new password" required error={fieldErrors.confirmPassword?.[0]}>
			<Input bind:value={confirmPassword} type="password" autocomplete="new-password" />
		</Field>

		{#snippet actions()}
			<Button type="submit" loading={submitting}>Change password</Button>
		{/snippet}
	</Form>
</Card>
