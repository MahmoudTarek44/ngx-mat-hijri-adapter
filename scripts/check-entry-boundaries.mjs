import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const libraryRoot = 'projects/ngx-mat-hijri-adapter';

// Entry points each entry may import, by package path or by relative path into its folder.
const allowed = {
  src: [],
  internal: ['src'],
  reactive: ['src', 'internal'],
  signals: ['src', 'internal'],
  native: ['src'],
};

const packageEntry = {
  'ngx-mat-hijri-adapter': 'src',
  'ngx-mat-hijri-adapter/internal': 'internal',
  'ngx-mat-hijri-adapter/reactive': 'reactive',
  'ngx-mat-hijri-adapter/signals': 'signals',
  'ngx-mat-hijri-adapter/native': 'native',
};

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const problems = [];

for (const [entry, imports] of Object.entries(allowed)) {
  const entryDir = entry === 'src' ? join(libraryRoot, 'src') : join(libraryRoot, entry, 'src');

  for (const file of files(entryDir).filter((name) => name.endsWith('.ts'))) {
    const source = readFileSync(file, 'utf8');
    const specifiers = [...source.matchAll(/(?:from|import|Url:)\s*\(?\s*'([^']+)'/g)].map(
      (match) => match[1],
    );

    for (const specifier of specifiers) {
      let target;
      if (specifier in packageEntry) {
        target = packageEntry[specifier];
      } else if (specifier.startsWith('.')) {
        const path = relative(libraryRoot, join(file, '..', specifier)).replaceAll('\\', '/');
        target = path.startsWith('src/') ? 'src' : path.split('/')[0];
      } else {
        if (entry === 'native' && specifier === '@internationalized/date') {
          problems.push(
            `${file.replaceAll('\\', '/')}: 'native' must not import '@internationalized/date'`,
          );
        }
        continue;
      }

      if (target !== entry && !imports.includes(target)) {
        problems.push(`${file.replaceAll('\\', '/')}: '${entry}' must not import '${specifier}'`);
      }
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
