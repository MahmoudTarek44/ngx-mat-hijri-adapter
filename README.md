<p align="center">
  <img src="projects/docs/public/logo.svg" alt="ngx-mat-hijri-adapter logo" width="120" />
</p>

<h1 align="center">ngx-mat-hijri-adapter</h1>

<p align="center">
  Angular Material date adapter and form fields for the Gregorian and Umm al-Qura Hijri calendars, built on <a href="https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date"><code>@internationalized/date</code></a>.
</p>

<p align="center">
  <a href="https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.2"><img src="https://img.shields.io/github/v/tag/MahmoudTarek44/ngx-mat-hijri-adapter?label=version&amp;color=006d33" alt="Version" /></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-22-dd0031" alt="Angular" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT" /></a>
  <a href="https://mahmoudtarek44.github.io/ngx-mat-hijri-adapter/"><img src="https://img.shields.io/badge/docs-live%20demo-006d33" alt="Documentation" /></a>
</p>

<p align="center">
  <strong><a href="https://mahmoudtarek44.github.io/ngx-mat-hijri-adapter/">Documentation and live demo →</a></strong>
</p>

## Features

- One `DateAdapter` for both calendars, switchable at runtime.
- Locale is independent of calendar: an English Hijri picker or an Arabic Gregorian picker both work.
- Ready-made date and date range fields for reactive forms and for signal forms.
- An optional Hijri/Gregorian toggle on each field, with a hint showing the date in the other calendar.
- Values are `CalendarDate` objects, never a JavaScript `Date`, so no time zone shifts a day.

## Status and installation

Version 0.2.2 is tagged on [GitHub](https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.2). It is not yet published to npm. Once it is, install it with its peer dependency:

```bash
npm install ngx-mat-hijri-adapter @internationalized/date
```

## Requirements

- Angular `core`, `forms`, `material`, and `cdk` 22.0.0 or newer.
- `@internationalized/date` 3.12.0 or newer.

## Quick start

Register the adapter once. The defaults are the Umm al-Qura calendar and the `ar-SA` locale.

```ts
import { provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

bootstrapApplication(App, {
  providers: [provideHijriDateAdapter()],
});
```

A plain `mat-datepicker` now works with `CalendarDate` values. Or use a ready-made field:

```ts
import { ReactiveDateField } from 'ngx-mat-hijri-adapter/reactive';
```

```html
<ngx-mat-reactive-date-field [formControl]="date" label="Date" calendarToggle />
```

## Entry points

| Import                           | Contents                                                       |
| -------------------------------- | -------------------------------------------------------------- |
| `ngx-mat-hijri-adapter`          | `HijriDateAdapter`, its provider, formatting, calendar helpers |
| `ngx-mat-hijri-adapter/reactive` | `ReactiveDateField` and `ReactiveDateRangeField`               |
| `ngx-mat-hijri-adapter/signals`  | `SignalDateField` and `SignalDateRangeField`                   |

Configuration, parsing, formatting, field inputs, right-to-left, and the full API are covered in the [documentation](https://mahmoudtarek44.github.io/ngx-mat-hijri-adapter/docs).

## Development

Building this workspace needs Node.js `^22.22.3`, `^24.15.0`, or `26` or newer. The docs app imports the built package from `dist/`, so build the library first:

```bash
npm ci
npm test
npm run build
npm start
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE). Copyright (c) 2026 Mahmoud.
