<script lang="ts">
	import { ApiError } from '$api/errors';
	import type { PatchUserInput } from '$api/schemas/user';
	import { Button } from '$lib/components/ui/buttons';
	import { Card } from '$lib/components/ui/display';
	import { Alert, toasts } from '$lib/components/ui/feedback';
	import { Field, Form, Input, Select } from '$lib/components/ui/forms';
	import { authState, updateProfile } from '$lib/state/auth.svelte';

	let displayName = $state(authState.user?.displayName ?? '');
	let email = $state(authState.user?.email ?? '');
	let timezone = $state(authState.user?.timezone ?? '');
	let submitting = $state(false);
	let formError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	const timezones = Intl.supportedValuesOf('timeZone');

	const changes = $derived.by(() => {
		const patch: PatchUserInput = {};
		if (displayName !== authState.user?.displayName) patch.displayName = displayName;
		if (email !== authState.user?.email) patch.email = email;
		if (timezone !== authState.user?.timezone) patch.timezone = timezone;
		return patch;
	});

	const dirty = $derived(Object.keys(changes).length > 0);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (submitting || !dirty) return;

		submitting = true;
		formError = null;
		fieldErrors = {};

		try {
			await updateProfile(changes);
			toasts.push({ tone: 'success', title: 'Profile updated' });
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
	<h2 class="text-h3 text-fg">Profile</h2>
{/snippet}

<Card {header}>
	<Form {onsubmit}>
		{#if formError}
			<Alert tone="danger">{formError}</Alert>
		{/if}

		<Field label="Display name" required error={fieldErrors.displayName?.[0]}>
			<Input bind:value={displayName} autocomplete="nickname" maxlength={25} />
		</Field>

		<Field label="Email" required error={fieldErrors.email?.[0]}>
			<Input bind:value={email} type="email" autocomplete="email" />
		</Field>

		<Field label="Timezone" error={fieldErrors.timezone?.[0]}>
			<Select bind:value={timezone}>
				{#if !timezones.includes(timezone)}
					<option value={timezone}>{timezone}</option>
				{/if}
				{#each timezones as zone (zone)}
					<option value={zone}>{zone}</option>
				{/each}
			</Select>
		</Field>

		{#snippet actions()}
			<Button type="submit" loading={submitting} disabled={!dirty}>Save</Button>
		{/snippet}
	</Form>
</Card>
