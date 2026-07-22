#!/usr/bin/env node
// Vérifie que tous les fichiers messages/*.json ont exactement les mêmes clés
// que la locale de référence (en.json). Exécuté par le hook prek `i18n-parity`.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'messages';
const BASE = 'en.json';

const keysOf = (file) => {
	const parsed = JSON.parse(readFileSync(join(DIR, file), 'utf8'));
	return new Set(Object.keys(parsed).filter((key) => key !== '$schema'));
};

const files = readdirSync(DIR).filter((file) => file.endsWith('.json'));
if (!files.includes(BASE)) {
	console.error(`Locale de référence introuvable : ${join(DIR, BASE)}`);
	process.exit(1);
}

const base = keysOf(BASE);
let failed = false;

for (const file of files.filter((file) => file !== BASE)) {
	const other = keysOf(file);
	const missing = [...base].filter((key) => !other.has(key));
	const extra = [...other].filter((key) => !base.has(key));

	if (missing.length) {
		failed = true;
		console.error(`${file} : ${missing.length} clé(s) manquante(s) — ${missing.join(', ')}`);
	}
	if (extra.length) {
		failed = true;
		console.error(`${file} : ${extra.length} clé(s) en trop — ${extra.join(', ')}`);
	}
}

if (failed) {
	console.error(`\nAligne les traductions sur ${join(DIR, BASE)}.`);
	process.exit(1);
}
