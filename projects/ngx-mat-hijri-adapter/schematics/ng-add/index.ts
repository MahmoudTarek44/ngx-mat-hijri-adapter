import { chain, SchematicsException, type Rule, type Tree } from '@angular-devkit/schematics';
import { addDependency, addRootProvider } from '@schematics/angular/utility';
import { getDependency } from '@schematics/angular/utility/dependency';

import type { NgAddOptions } from './schema';

const CALENDAR_PACKAGE = '@internationalized/date';
const CALENDAR_VERSION = '^3.12.0';

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
  let found = false;

  tree.visit((path) => {
    if (found || !path.endsWith('.ts')) {
      return;
    }

    found = tree.readText(path).includes('provideHijriDateAdapter');
  });

  return found;
}
