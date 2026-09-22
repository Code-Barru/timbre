<script lang="ts">
	import GearIcon from 'phosphor-svelte/lib/GearIcon';
	import HouseIcon from 'phosphor-svelte/lib/HouseIcon';
	import SignOutIcon from 'phosphor-svelte/lib/SignOutIcon';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { DropdownMenu, MenuItem, Sidebar, type NavSection } from '$lib/components/ui';
	import { authState, logout } from '$lib/state/auth.svelte';
	import { CardholderIcon, CaretUpDownIcon, UserIcon } from 'phosphor-svelte';

	let { children } = $props();

	const sections: NavSection[] = [
		{
			items: [
				{ label: 'Home', icon: HouseIcon, path: '/' },
				{ label: 'Decks', icon: CardholderIcon, path: '/decks' }
			]
		}
	];

	async function signOut() {
		await logout();
		await goto(resolve('/auth/login'));
	}
</script>

{#snippet profileMenu()}
	<hr class="text-neutral-subtle" />
	<DropdownMenu
		placement="top"
		align="start"
		class="w-54"
		triggerClass="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 my-2 text-sm text-fg-secondary transition-colors duration-150 ease-out hover:bg-neutral-subtle active:bg-neutral-subtle-hover hover:text-fg"
	>
		{#snippet trigger()}
			<UserIcon size={16} class="shrink-0" />
			<span class="flex-1 truncate text-left">{authState.user?.displayName}</span>
			<CaretUpDownIcon size={16} />
		{/snippet}

		<MenuItem onselect={() => goto(resolve('/settings'))}>
			{#snippet icon()}<GearIcon size={16} />{/snippet}
			Settings
		</MenuItem>
		<MenuItem tone="danger" onselect={signOut}>
			{#snippet icon()}<SignOutIcon size={16} />{/snippet}
			Log out
		</MenuItem>
	</DropdownMenu>
{/snippet}

<div class="flex h-screen min-h-screen">
	<Sidebar title="Timbre" {sections} footer={profileMenu} />
	<main class="flex-1 overflow-y-auto p-6">
		{@render children()}
	</main>
</div>
