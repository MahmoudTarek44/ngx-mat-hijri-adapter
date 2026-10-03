# ngx-mat-hijri-adapter

Modern Angular Material date adapter for Gregorian and Umm al-Qura Hijri calendars, powered by [`@internationalized/date`](https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date).

**Version 0.0.0 is not published.** The date adapter is not implemented yet. This repository is the Angular workspace for that library.

## Requirements

- Angular 22.0.0 or newer. [Signal forms](https://angular.dev/guide/forms/signals/comparison) are stable from this version, and the package will not support Angular 21.
- Node.js `^22.22.3`, `^24.15.0`, or `26` or newer, to build this workspace.

## What this version exports

```ts
import { NGX_MAT_HIJRI_ADAPTER_VERSION } from 'ngx-mat-hijri-adapter';
```

`NGX_MAT_HIJRI_ADAPTER_VERSION` is `'0.0.0'`.

`provideHijriDateAdapter()`, calendar conversion, parsing, and the `reactive` and `signals` entry points are not in this version.

## Develop

Install dependencies, build the library, then run the demo. The demo imports the built package from `dist/ngx-mat-hijri-adapter`.

```bash
npm ci
npm test
npm run build
npx ng serve demo
```

The production library build uses partial compilation, as required by the [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format).

## License

[MIT](LICENSE). Copyright (c) 2026 Mahmoud.
