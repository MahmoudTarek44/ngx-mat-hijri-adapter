# ngx-mat-hijri-adapter

Modern Angular Material date adapter for Gregorian and Umm al-Qura Hijri calendars, powered by [`@internationalized/date`](https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date).

**Version 0.0.0 is not published.** The date adapter is not implemented yet. This repository is the Angular workspace for that library.

## Requirements

- Angular 22.0.0 or newer. [Signal forms](https://angular.dev/guide/forms/signals/comparison) are stable from this version, and the package will not support Angular 21.
- Node.js `^22.22.3`, `^24.15.0`, or `26` or newer, to build this workspace.

## What this version exports

Calendar values are `CalendarDate` objects from `@internationalized/date`. A JavaScript `Date` is not the calendar value. Supported calendars are `gregorian` and `islamic-umalqura`. Umm al-Qura years are AH 1300–1599. AH 1600 is rejected because the underlying table falls back to the civil Islamic calendar.

```ts
import {
  createCalendarDate,
  convertCalendarDate,
  NGX_MAT_HIJRI_ADAPTER_VERSION,
} from 'ngx-mat-hijri-adapter';

const hijri = createCalendarDate('islamic-umalqura', 1445, 9, 1);
const gregorian = convertCalendarDate(hijri, 'gregorian');
```

`NGX_MAT_HIJRI_ADAPTER_VERSION` is `'0.0.0'`. `1445-09-01` Umm al-Qura is `2024-03-11` Gregorian.

Locale does not select the calendar. `provideHijriDateAdapter()`, parsing, formatting, and the `reactive` and `signals` entry points are not in this version.

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
