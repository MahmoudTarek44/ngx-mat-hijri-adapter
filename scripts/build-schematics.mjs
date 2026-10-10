import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const compiled = spawnSync(
  process.execPath,
  [
    'node_modules/typescript/lib/tsc.js',
    '-p',
    'projects/ngx-mat-hijri-adapter/tsconfig.schematics.json',
  ],
  { stdio: 'inherit' },
);

if (compiled.status !== 0) {
  process.exit(compiled.status ?? 1);
}

const libraryRoot = 'projects/ngx-mat-hijri-adapter';
const outputRoot = 'dist/ngx-mat-hijri-adapter';
const jsonFiles = [
  'schematics/package.json',
  'schematics/collection.json',
  'schematics/migration-collection.json',
  'schematics/ng-add/schema.json',
];

for (const file of jsonFiles) {
  const target = join(outputRoot, file);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(libraryRoot, file), target);
}
