# Contributing

Pull requests for ngx-mat-hijri-adapter target `development`. `main` tracks released tags.

Keep each pull request to one focused change. Search the open and closed pull requests first so the same work is not submitted twice.

## Area of impact

Every pull request names the kind of change. Use one of these areas, and the matching [Angular commit type](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) in the commit subject:

| Area          | Commit type      |
| ------------- | ---------------- |
| Feature       | `feat`           |
| Bug           | `fix`            |
| Refactor      | `refactor`       |
| Enhancement   | `feat` or `perf` |
| Documentation | `docs`           |
| Test          | `test`           |
| Build or CI   | `build` or `ci`  |
| Other upkeep  | `chore`          |

The subject is imperative and present tense, for example `fix: keep the two calendars on the same day`.

## Breaking changes

Every pull request says whether the change is breaking.

A breaking change alters a public export, a stored value, a schematic, or the documented setup so an existing app must be updated. When it is breaking, describe what changes and how to migrate. Start the commit footer with `BREAKING CHANGE:` followed by that migration note.

## Tests

Unit tests are required for submitted code. Cover the behavior the pull request adds or changes in the library, the schematics, or the docs app. A docs-only change still leaves the existing suites passing.

```bash
npm test
npm run test:docs
```

## Dependencies

A pull request must not install a third-party library. Do not add, upgrade, or remove a package in `dependencies`, `devDependencies`, or peer dependencies.

## Code quality

Match the surrounding code and the current Angular 22 practices:

- Strict TypeScript. Do not use `any`.
- Standalone components and OnPush change detection are the defaults. Do not set either explicitly.
- Use signals, `input()`, `output()`, and `model()`. Use `inject()` instead of constructor injection.
- Use native control flow (`@if`, `@for`, `@switch`).
- Put host bindings in the `host` object.
- Keep new UI at WCAG AA, including accessible names, focus, and contrast.
- Follow `.editorconfig`: 2-space indentation, UTF-8, and single quotes in TypeScript.
- Document a new public export and export it from the package's public API.

## Build and test

Building this workspace needs Node.js `^22.22.3`, `^24.15.0`, or `26` or newer.

```bash
npm ci
npm test
npm run build
npm run test:docs
npm run build:docs
```

`npm start` serves the docs app. That app imports the built package from `dist/`, so build the library before starting it.

Pull requests run the same checks in CI: library tests, the library build, the docs build, and docs tests.

## Releases

npm publishing starts at the stable 1.0.0. Version 0.3.0 is tagged on GitHub and is not published on npm. A pull request does not publish a package.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
