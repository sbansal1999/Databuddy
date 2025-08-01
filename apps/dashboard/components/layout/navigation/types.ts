import type { Icon } from '@phosphor-icons/react';

export interface NavigationItem {
	name: string;
	icon: Icon;
	href: string;
	rootLevel?: boolean;
	external?: boolean;
	highlight?: boolean;
	alpha?: boolean;
	production?: boolean;
}

export interface NavigationSection {
	title: string;
	items: NavigationItem[];
}
