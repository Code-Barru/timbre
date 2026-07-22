#!/usr/bin/env node
// Refuse un commit qui modifie un schéma Drizzle sans embarquer de migration.
// Exécuté par le hook prek `drizzle-migration`.
// Échappatoire : SKIP=drizzle-migration git commit ...

import { execFileSync } from 'node:child_process';

const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
	encoding: 'utf8'
})
	.split('\n')
	.filter(Boolean);

const schemas = staged.filter((file) => /^src\/lib\/server\/db\/.*\.schema\.ts$/.test(file));
if (schemas.length === 0) process.exit(0);

const migrations = staged.filter((file) => /^drizzle\/.*\.sql$/.test(file));
if (migrations.length > 0) process.exit(0);

console.error('Schéma Drizzle modifié sans migration :');
for (const schema of schemas) console.error(`  ${schema}`);
console.error('\nLance `npm run db:generate` puis stage le fichier drizzle/*.sql généré.');
console.error('Si le changement est purement cosmétique : SKIP=drizzle-migration git commit ...');
process.exit(1);
