import type { Component } from 'svelte';
import type { IconComponentProps } from 'phosphor-svelte';
import type { Pathname } from '$app/types';

export interface NavLink {
	label: string;
	icon: Component<IconComponentProps>;
	path: Pathname;
}

export interface NavSection {
	title?: string;
	items: NavLink[];
}
