import {
  chain,
  SchematicsException,
  type DirEntry,
  type Rule,
  type Tree,
} from '@angular-devkit/schematics';
import { addDependency, addRootProvider } from '@schematics/angular/utility';
import { getDependency } from '@schematics/angular/utility/dependency';

import type { NgAddOptions } from './schema';

const CALENDAR_PACKAGE = '@internationalized/date';
const CALENDAR_VERSION = '^3.12.0';
/** Installed packages and build output mention the provider without the app calling it. */
const SKIPPED_DIRS = new Set(['node_modules', 'dist', '.angular', '.git']);

export function ngAdd(options: NgAddOptions): Rule {
  return (tree) => {
    if (!options.project) {
      throw new SchematicsException('Pass a project name to ng add.');
    }

    if (!getDependency(tree, '@angular/material')) {
      throw new SchematicsException(
        'Install @angular/material before adding ngx-mat-hijri-adapter.',
      );
    }

    const rules: Rule[] = [];

    if (!getDependency(tree, CALENDAR_PACKAGE)) {
      rules.push(addDependency(CALENDAR_PACKAGE, CALENDAR_VERSION));
    }

    if (!providesAdapter(tree)) {
      rules.push(
        addRootProvider(options.project, ({ code, external }) => {
          return code`${external('provideHijriDateAdapter', 'ngx-mat-hijri-adapter')}()`;
        }),
      );
    }

    return chain(rules);
  };
}

function providesAdapter(tree: Tree): boolean {
  return dirProvidesAdapter(tree.getDir('/'));
}

function dirProvidesAdapter(dir: DirEntry): boolean {
  for (const name of dir.subfiles) {
    if (!name.endsWith('.ts') || name.endsWith('.d.ts')) {
      continue;
    }
    if (dir.file(name)?.content.toString('utf8').includes('provideHijriDateAdapter')) {
      return true;
    }
  }

  return dir.subdirs.some((name) => !SKIPPED_DIRS.has(name) && dirProvidesAdapter(dir.dir(name)));
}
