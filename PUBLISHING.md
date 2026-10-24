# Publishing to npm

Maintainer steps for putting `ngx-mat-hijri-adapter` on npm. This is not the install guide. Version 0.4.3 is tagged on GitHub and is not on npm. A pull request does not publish a package, and a GitHub tag does not either.

The first npm release is **1.0.0-beta.0** on the dist-tag `beta`. Stable 1.0.0 takes `latest` later. `npm install ngx-mat-hijri-adapter` does not install the beta. Install it with:

```bash
npm install ngx-mat-hijri-adapter@beta
```

`ng add ngx-mat-hijri-adapter` stays the install command once the package is on npm.

## What is published

Publish `dist/ngx-mat-hijri-adapter` after `npm run build`. Do not publish the workspace root. The root `package.json` is `"private": true`.

The built package comes from `projects/ngx-mat-hijri-adapter/package.json`:

- Peers: `@angular/cdk`, `@angular/core`, `@angular/forms`, and `@angular/material` at `>=22.0.0`, and `@internationalized/date` at `>=3.12.0`
- The only dependency is `tslib`
- Entries: the main barrel, plus `native`, `reactive`, `signals`, and `internal`
- Schematics: `ng-add` and the `ng update` migration collection, compiled by `npm run build`

`scripts/stage-package-files.mjs` copies the root `README.md`, `LICENSE`, and `CHANGELOG.md` into `projects/ngx-mat-hijri-adapter/` before the build. Those copies are gitignored. ng-packagr then ships the README, the changelog, and `agents/SKILL.md` with the package.

Before the first publish, set `homepage` in `projects/ngx-mat-hijri-adapter/package.json` to `https://ngx-mat-hijri-adapter.dev/`. Keep the GitHub `repository` URL.

Ready-made fields store a `CalendarDate`. `ngx-mat-hijri-adapter/native` remains the `Date` alternative. Changing the stored field type from `CalendarDate` to `Date` after 1.0.0 is a breaking release.

## Authentication

Log in to npm on the maintainer machine. No npm token goes in the repo. No GitHub Action publishes on tag. `.github/workflows/ci.yml` runs tests and builds only.

## Version bump

The beta release commit bumps `0.4.3` to `1.0.0-beta.0` in:

- `package.json`
- The two root version fields in `package-lock.json` (the top-level `version` and `packages[""].version`)
- `projects/ngx-mat-hijri-adapter/package.json`
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` and `version.spec.ts`
- The living version lines in `README.md`, `CONTRIBUTING.md`, and `ROADMAP.md`
- A new `CHANGELOG.md` section for `1.0.0-beta.0`

Do not rewrite older changelog entries. Add the new section above them, and add a link at the bottom:

```text
[1.0.0-beta.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/1.0.0-beta.0
```

The new section says this beta is on npm under the `beta` tag, ready-made fields store `CalendarDate`, and `ngx-mat-hijri-adapter/native` remains the `Date` alternative.

The docs app reads `NGX_MAT_HIJRI_ADAPTER_VERSION` from the built package. `projects/docs/src/app/app.spec.ts` must expect `1.0.0-beta.0` and the tag URL `https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/1.0.0-beta.0`.

Leave the unpublished banner in place until the beta is actually on npm. It lives in `projects/docs/src/app/app.html` (`data-release-banner`) and the `shell.bannerBefore` / `shell.bannerAfter` strings in `projects/docs/src/locale/en.json` and `ar.json`. Getting started uses `gettingStarted.version` in those same files. Remove that banner, and the living "not on npm" sentences, in a follow-up only after `npm publish` succeeds.

## Docs site and prerelease tags

`.github/workflows/pages.yml` deploys the docs site when a tag matches `[0-9]+.[0-9]+.[0-9]+`. That matches `0.4.3` and `1.0.0`. It does not match `1.0.0-beta.0`.

Widen that filter in the beta release commit, or the tag push will not deploy the docs site and the site will stay on the last numeric tag. A filter that also matches this prerelease is:

```yaml
tags: ['[0-9]+.[0-9]+.[0-9]+', '[0-9]+.[0-9]+.[0-9]+-beta.[0-9]+']
```

The workflow builds and deploys the docs app. It does not publish to npm.

## Checks

From the repo root, before the release commit is tagged:

```bash
npm view ngx-mat-hijri-adapter
```

That command must fail with a 404. The unscoped name is still free. If the name is taken, stop. Do not scope the package and do not pick another name in the same commit.

Then:

```bash
npm test
npm run build
npm run test:docs
npm run build:docs
```

`npm test` covers the library, including the version spec. `npm run build` stages the README, license, and changelog, builds the five entries, and compiles the schematics. Docs tests resolve the package from `dist/`, so they run after that build.

In `dist/ngx-mat-hijri-adapter`:

```bash
npm pack --dry-run
```

The dry run must list:

- `package.json` with version `1.0.0-beta.0` and `homepage` `https://ngx-mat-hijri-adapter.dev/`
- `fesm2022/` and `types/` for the main entry and for `native`, `reactive`, `signals`, and `internal`
- `schematics/`, including `collection.json` and `migration-collection.json`
- `README.md`, `LICENSE`, `CHANGELOG.md`, and `agents/SKILL.md`

It must not list the docs app, the workspace root, or `node_modules`.

## Bundle size

Measured from the 0.4.1 build after the date adapters cache their `Intl` formatters. Gzip is what an app downloads. The tarball also contains source maps, type declarations, and `CHANGELOG.md`, which the browser does not load.

| FESM | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| `ngx-mat-hijri-adapter.mjs` | 17,696 | 5,015 |
| `ngx-mat-hijri-adapter-native.mjs` | 18,748 | 4,683 |
| `ngx-mat-hijri-adapter-internal.mjs` | 13,566 | 3,274 |
| `ngx-mat-hijri-adapter-reactive.mjs` | 29,739 | 4,720 |
| `ngx-mat-hijri-adapter-signals.mjs` | 31,746 | 4,514 |

The packed tarball is 76,844 bytes (382,372 unpacked, 33 files).

An app that imports only `provideHijriDateAdapter()` downloads the main FESM, about 5,015 bytes gzip, plus the peer `@internationalized/date`. It does not download the reactive or signal fields. `"sideEffects": false` stays set so unused exports can be dropped. Do not merge the five entry points, and do not add a second bundler.

Before `1.0.0-beta.0` is published, `npm run build` then confirm:

- The main and `internal` FESM files import `@internationalized/date`. They do not contain its implementation.
- The `native` FESM does not import `@internationalized/date`.
- No FESM contains the docs app or a spec file.
- `npm pack --dry-run` in `dist/ngx-mat-hijri-adapter` stays at 33 files and does not list the docs app.

These gzip numbers are the budget. A later publish that grows a FESM without a new feature has to explain the growth in this file. The Umm al-Qura month lengths stay one bit string for AH 1300–1599. Do not turn that string into a number array, and do not drop years.

`HijriDateAdapter` and `NativeHijriDateAdapter` keep `Intl.DateTimeFormat` and `Intl.NumberFormat` for the locale they are using, and reuse the month, weekday, and date labels. Changing the locale clears that cache. Changing the native adapter's calendar drops the formatters that depend on it. The labels stay the same.

## Publish, then tag

Ship the release commit to `development`, then fast-forward `main`, and push both branches. The commit is on `main` before anything is sent to npm.

From `dist/ngx-mat-hijri-adapter`, after that push:

```bash
npm publish --access public --tag beta
```

`--access public` is required because this is the first publish of an unscoped package. `--tag beta` keeps `latest` empty. Omitting `--tag` would publish on `latest`, which is reserved for stable 1.0.0.

Confirm the registry:

```bash
npm view ngx-mat-hijri-adapter@beta version
```

The version must be `1.0.0-beta.0`. `npm view ngx-mat-hijri-adapter version` must still have no `latest` release.

Only after `npm publish` succeeds, tag that same commit. Tags are lightweight and have no `v` prefix:

```bash
git tag 1.0.0-beta.0
git push origin 1.0.0-beta.0
```

If publish fails, do not create the tag. npm will not accept the same version again, so a failed attempt that did reach the registry cannot be reused. A failed attempt that did not reach the registry can be fixed and published as the same version.

After the beta is on npm, remove the unpublished banner and point Getting started, the README, and `CONTRIBUTING.md` at `npm install ngx-mat-hijri-adapter@beta` beside `ng add`.

## Stable 1.0.0

Stable 1.0.0 uses this same checklist after the beta is already published. Differences:

- `npm view ngx-mat-hijri-adapter` no longer 404s. Check `npm view ngx-mat-hijri-adapter versions` and do not reuse `1.0.0-beta.0`.
- The version is `1.0.0`. The Pages tag filter already matches it.
- Publish with `npm publish --access public` from `dist/ngx-mat-hijri-adapter` so the dist-tag is `latest`. Do not pass `--tag beta`.
- Tag `1.0.0` only after that publish succeeds, then push the tag.
- `npm install ngx-mat-hijri-adapter` and `ng add ngx-mat-hijri-adapter` then install the stable release. The `beta` tag remains available until it is moved.

`latest` stays empty until this stable publish.
