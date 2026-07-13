<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';
	import { Button, Input } from '$lib/components/primitives';
	import { FormField } from '$lib/components/patterns';
	import { m } from '$lib/paraglide/messages.js';

	let { form }: { form: ActionData } = $props();

	let email = $state('');
	let password = $state('');
	let submitting = $state(false);

	const errorKeys: Record<string, () => string> = {
		auth_error_generic: m.auth_error_generic,
		auth_email_invalid: m.auth_email_invalid,
		auth_password_invalid: m.auth_password_invalid
	};
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm rounded-lg border border-border bg-surface-raised p-6 shadow-sm">
		<h1 class="mb-6 text-h1 text-text">{m.sign_in_title()}</h1>

		<form
			method="post"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
			class="flex flex-col gap-4"
		>
			<FormField label={m.auth_email_label()} id="email">
				<Input id="email" type="email" name="email" bind:value={email} required />
			</FormField>
			<FormField label={m.auth_password_label()} id="password">
				<Input id="password" type="password" name="password" bind:value={password} required />
			</FormField>

			{#if form?.message}
				<p class="text-caption font-medium text-danger">
					{errorKeys[form.message]?.() ?? form.message}
				</p>
			{/if}

			<Button type="submit" block loading={submitting}>{m.sign_in_submit()}</Button>
		</form>

		<p class="mt-4 text-caption text-text-muted">
			{m.sign_in_no_account()}
			<a href={resolve('/sign-up')} class="font-semibold text-primary hover:underline"
				>{m.sign_in_link_sign_up()}</a
			>
		</p>
	</div>
</div>
