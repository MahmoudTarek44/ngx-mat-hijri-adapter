import { HostTree, SchematicsException } from '@angular-devkit/schematics';
import { SchematicTestRunner, type UnitTestTree } from '@angular-devkit/schematics/testing';

const collectionPath = 'dist/ngx-mat-hijri-adapter/schematics/collection.json';
const migrationPath = 'dist/ngx-mat-hijri-adapter/schematics/migration-collection.json';

const APP_CONFIG = '/src/app/app.config.ts';

describe('ng-add', () => {
  const runner = new SchematicTestRunner('ngx-mat-hijri-adapter', collectionPath);

  function workspace(dependencies: Record<string, string>): HostTree {
    const tree = new HostTree();
    tree.create('/package.json', JSON.stringify({ dependencies }));
    tree.create(
      '/angular.json',
      JSON.stringify({
        version: 1,
        projects: {
          app: {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: { browser: 'src/main.ts' },
              },
            },
          },
        },
      }),
    );
    tree.create(
      '/src/main.ts',
      `import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig);
`,
    );
    tree.create(
      APP_CONFIG,
      `import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
`,
    );
    return tree;
  }

  it('inserts the provider once and schedules the calendar peer', async () => {
    const tree = await runner.runSchematic(
      'ng-add',
      { project: 'app' },
      workspace({
        '@angular/material': '^22.2.0',
      }),
    );

    expect(providerCount(tree)).toBe(1);
    expect(tree.readContent('/package.json')).toContain('"@internationalized/date": "^3.12.0"');
    expect(runner.tasks).toEqual([
      expect.objectContaining({
        name: 'node-package',
        options: expect.objectContaining({ command: 'install' }),
      }),
    ]);

    const again = await runner.runSchematic('ng-add', { project: 'app' }, tree);

    expect(providerCount(again)).toBe(1);
    expect(runner.tasks).toEqual([]);
  });

  it('leaves an installed calendar peer alone', async () => {
    const tree = await runner.runSchematic(
      'ng-add',
      { project: 'app' },
      workspace({
        '@angular/material': '^22.2.0',
        '@internationalized/date': '^3.12.4',
      }),
    );

    expect(providerCount(tree)).toBe(1);
    expect(
      JSON.parse(tree.readContent('/package.json')).dependencies['@internationalized/date'],
    ).toBe('^3.12.4');
    expect(runner.tasks).toEqual([]);
  });

  it('stops when Angular Material is missing', async () => {
    const tree = workspace({});

    await expect(runner.runSchematic('ng-add', { project: 'app' }, tree)).rejects.toThrow(
      SchematicsException,
    );
    expect(tree.readText(APP_CONFIG)).not.toContain('provideHijriDateAdapter');
  });
});

describe('ng-update', () => {
  const runner = new SchematicTestRunner('ngx-mat-hijri-adapter', migrationPath);

  it('leaves the project unchanged', async () => {
    const tree = new HostTree();
    tree.create('/package.json', '{}\n');

    const updated = await runner.runSchematic('migration-v1', {}, tree);

    expect(updated.readContent('/package.json')).toBe('{}\n');
  });
});

function providerCount(tree: UnitTestTree): number {
  return tree.readContent(APP_CONFIG).match(/provideHijriDateAdapter\(/g)?.length ?? 0;
}
