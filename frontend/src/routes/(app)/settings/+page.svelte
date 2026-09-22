<script lang="ts">
	import { Tabs } from '$lib/components/ui/data';
	import { DeleteAccount, PasswordForm, PreferencesForm, ProfileForm } from '$lib/components/forms';

	let { data } = $props();

	let tab = $state('preferences');
</script>

<svelte:head><title>Settings · Timbre</title></svelte:head>

<div class="mx-auto flex max-w-4xl flex-col gap-6">
	<h1 class="text-h3 text-fg">Settings</h1>

	<Tabs
		bind:value={tab}
		label="Settings sections"
		orientation="vertical"
		tabs={[
			{ value: 'preferences', label: 'Preferences' },
			{ value: 'account', label: 'Account' },
			{ value: 'password', label: 'Password' }
		]}
	>
		{#if tab === 'preferences'}
			<PreferencesForm initial={data.preferences} />
		{:else if tab === 'password'}
			<PasswordForm />
		{:else}
			<div class="flex flex-col gap-6">
				<ProfileForm />
				<DeleteAccount />
			</div>
		{/if}
	</Tabs>
</div>
