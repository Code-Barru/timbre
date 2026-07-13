<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';
	import { Button, Input } from '$lib/components/primitives';
	import { FormField } from '$lib/components/patterns';
	import { m } from '$lib/paraglide/messages.js';
	import { signUpSchema } from '$lib/schemas/auth';

	let { form }: { form: ActionData } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let submitting = $state(false);

	let passwordMismatch = $derived(confirmPassword.length > 0 && password !== confirmPassword);

	const errorKeys: Record<string, () => string> = {
		auth_error_generic: m.auth_error_generic,
		auth_email_invalid: m.auth_email_invalid,
		auth_password_invalid: m.auth_password_invalid,
		sign_up_name_invalid: m.sign_up_name_invalid
	};

	let validation = $derived(signUpSchema.safeParse({ name, email, password }));
	let fieldErrors = $derived.by(() => {
		const errors: Record<string, string> = {};
		if (!validation.success) {
			for (const issue of validation.error.issues) {
				const field = issue.path[0] as string;
				errors[field] ??= errorKeys[issue.message]?.() ?? issue.message;
			}
		}
		return errors;
	});
	let nameError = $derived(name.length > 0 ? fieldErrors.name : undefined);
	let emailError = $derived(email.length > 0 ? fieldErrors.email : undefined);
	let passwordError = $derived(password.length > 0 ? fieldErrors.password : undefined);
</script>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm rounded-lg border border-border bg-surface-raised p-6 shadow-sm">
		<h1 class="mb-6 text-h1 text-text">{m.sign_up_title()}</h1>

		<form
			method="post"
			use:enhance={({ cancel }) => {
				if (!validation.success || password !== confirmPassword) {
					cancel();
					return;
				}
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
			class="flex flex-col gap-4"
		>
			<FormField label={m.sign_up_name_label()} id="name" error={nameError}>
				<Input id="name" name="name" bind:value={name} invalid={!!nameError} required />
			</FormField>
			<FormField label={m.auth_email_label()} id="email" error={emailError}>
				<Input
					id="email"
					type="email"
					name="email"
					bind:value={email}
					invalid={!!emailError}
					required
				/>
			</FormField>
			<FormField label={m.auth_password_label()} id="password" error={passwordError}>
				<Input
					id="password"
					type="password"
					name="password"
					bind:value={password}
					invalid={!!passwordError}
					required
				/>
			</FormField>
			<FormField
				label={m.sign_up_confirm_password_label()}
				id="confirm-password"
				error={passwordMismatch ? m.sign_up_password_mismatch() : undefined}
			>
				<Input
					id="confirm-password"
					type="password"
					bind:value={confirmPassword}
					invalid={passwordMismatch}
					required
				/>
			</FormField>

			{#if form?.message}
				<p class="text-caption font-medium text-danger">
					{errorKeys[form.message]?.() ?? form.message}
				</p>
			{/if}

			<Button
				type="submit"
				block
				loading={submitting}
				disabled={!validation.success || passwordMismatch}>{m.sign_up_submit()}</Button
			>
		</form>

		<p class="mt-4 text-caption text-text-muted">
			{m.sign_up_have_account()}
			<a href={resolve('/sign-in')} class="font-semibold text-primary hover:underline"
				>{m.sign_up_link_sign_in()}</a
			>
		</p>
	</div>
</div>
