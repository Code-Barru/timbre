<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ApiError } from '$api/errors';
	import { Button } from '$lib/components/ui/buttons';
	import { Card } from '$lib/components/ui/display';
	import { toasts } from '$lib/components/ui/feedback';
	import { Dialog } from '$lib/components/ui/overlays';
	import { deleteAccount } from '$lib/state/auth.svelte';

	let open = $state(false);
	let deleting = $state(false);

	async function confirmDelete() {
		if (deleting) return;
		deleting = true;
		try {
			await deleteAccount();
			await goto(resolve('/auth/login'));
		} catch (err) {
			toasts.push({
				tone: 'danger',
				title: 'Could not delete account',
				description: err instanceof ApiError ? err.message : 'Unknown error'
			});
		} finally {
			deleting = false;
			open = false;
		}
	}
</script>

<Card>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex flex-col gap-1">
			<h2 class="text-h3 text-fg">Delete account</h2>
			<p class="text-sm text-fg-muted">Permanently remove your account and all of its data.</p>
		</div>
		<Button tone="danger" onclick={() => (open = true)}>Delete account</Button>
	</div>
</Card>

<Dialog
	bind:open
	title="Delete your account?"
	description="Your decks, cards and review history will be permanently deleted."
>
	<div class="flex flex-col gap-4">
		<p class="text-sm text-fg-secondary">This action cannot be undone.</p>
		<div class="flex justify-end gap-4">
			<Button variant="ghost" tone="neutral" onclick={() => (open = false)}>Cancel</Button>
			<Button tone="danger" loading={deleting} onclick={confirmDelete}>Delete account</Button>
		</div>
	</div>
</Dialog>
