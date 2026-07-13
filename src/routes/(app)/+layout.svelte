<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { House, ChartColumn, Settings, Folder, Play, LogOut, ChevronDown, User } from '@lucide/svelte';
	import { SidebarNav, BottomNav, type NavItem } from '$lib/components/navigation';
	import { Divider } from '$lib/components/primitives';
	import { DropdownMenu } from '$lib/components/overlays';
	import '../../app.css'
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutServerData } from './$types';

	let { data, children }: { data: LayoutServerData; children: Snippet } = $props();

	let path: string = $derived(page.url.pathname);

	let sidebarItems = $derived<NavItem[]>([
		{ label: 'Home', icon: House, href: '/', active: path === '/' },
		{ label: 'Review', icon: Play, href: '/review', active: path === '/review' },
		{ label: 'Decks', icon: Folder, href: '/decks', active: path === '/decks' },
		{ label: 'Stats', icon: ChartColumn, href: '/stats', active: path === '/stats' },
	]);

	let bottomItems = $derived<NavItem[]>([
		{ label: 'Home', icon: House, href: '/', active: path === '/' },
		{ label: 'Decks', icon: Folder, href: '/decks', active: path === '/decks' },
		{ label: 'Stats', icon: ChartColumn, href: '/stats', active: path === '/stats' },
		{ label: 'Settings', icon: Settings, href: '/settings', active: path === '/settings' }
	]);

	let userMenuOpen = $state(false);

	let displayName = $derived(
		data.user.name.length > 15 ? data.user.name.slice(0, 15) + '…' : data.user.name
	);

	const userMenuItems = [
		{ label: 'Settings', icon: Settings, onselect: () => goto('/settings') },
		{ label: 'Sign out', icon: LogOut, danger: true, separator: true, onselect: () => goto('/sign-out') }
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen">
	<SidebarNav class="hidden md:flex" items={sidebarItems}>
		{#snippet logo()}
			<img src={favicon} alt="" class="h-[30px] w-[30px] flex-none" />
		{/snippet}
		{#snippet footer()}
			<Divider class="mb-2" />
			<DropdownMenu items={userMenuItems} bind:open={userMenuOpen}>
				{#snippet trigger()}
					<div
						class="flex w-full items-center gap-2.5 rounded-md px-[11px] py-[9px] text-sm font-semibold text-text-muted transition hover:bg-surface-sunken"
					>
            <User size={18} />
						<span class="min-w-0 flex-1 truncate text-left" title={data.user.name}>{displayName}</span>
						<ChevronDown
							size={14}
							class="flex-none text-text-faint transition-transform {userMenuOpen ? 'rotate-180' : ''}"
						/>
					</div>
				{/snippet}
			</DropdownMenu>
		{/snippet}
	</SidebarNav>

	<main class="min-w-0 flex-1 pb-20 md:pb-0">
		{@render children()}
	</main>

	<div class="fixed inset-x-0 bottom-0 p-2 md:hidden">
		<BottomNav items={bottomItems} fabIcon={Play} fabLabel="Review" onfab={() => goto('/review')} />
	</div>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
