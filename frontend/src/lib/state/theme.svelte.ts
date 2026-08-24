import { browser } from '$app/environment';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'timbre-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function storedChoice(): ThemeChoice {
	if (!browser) return 'system';
	const stored = localStorage.getItem(STORAGE_KEY);
	return stored === 'light' || stored === 'dark' ? stored : 'system';
}

class ThemeState {
	#choice = $state<ThemeChoice>(storedChoice());
	#systemDark = $state(browser ? window.matchMedia(DARK_QUERY).matches : false);

	constructor() {
		if (!browser) return;
		window.matchMedia(DARK_QUERY).addEventListener('change', (event) => {
			this.#systemDark = event.matches;
			this.#apply();
		});
		this.#apply();
	}

	get choice(): ThemeChoice {
		return this.#choice;
	}

	get resolved(): ResolvedTheme {
		if (this.#choice === 'system') return this.#systemDark ? 'dark' : 'light';
		return this.#choice;
	}

	set(next: ThemeChoice) {
		this.#choice = next;
		if (!browser) return;
		if (next === 'system') localStorage.removeItem(STORAGE_KEY);
		else localStorage.setItem(STORAGE_KEY, next);
		this.#apply();
	}

	toggle() {
		this.set(this.resolved === 'dark' ? 'light' : 'dark');
	}

	#apply() {
		if (this.#choice === 'system') delete document.documentElement.dataset.theme;
		else document.documentElement.dataset.theme = this.#choice;
	}
}

export const theme = new ThemeState();
