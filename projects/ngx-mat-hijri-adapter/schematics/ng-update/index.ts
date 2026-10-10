import type { Rule } from '@angular-devkit/schematics';

/** Keeps `ng update` working before the first breaking change. */
export function migrate(): Rule {
  return (tree) => tree;
}
