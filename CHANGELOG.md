# Changelog

All notable changes to ngx-mat-hijri-adapter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-03

### ✨ New Features

First release. One Angular Material date adapter for the Gregorian and Umm al-Qura calendars, calendar helpers for `CalendarDate` values, and ready-made date and date range fields for reactive forms and signal forms. Each feature commit below is a squash of one feature branch into `development`. The branches held work-in-progress commits only, so there are no original subjects to list.

#### Changes by Commit

| Commit    | Type        | Description                                                                                                                   |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `0e67526` | ✨ Feature  | **Calendar Dates**: Create, convert, compare, and add to `CalendarDate` values in both calendars, limited to AH 1300–1599     |
| `b67c1b1` | ✨ Feature  | **Date Adapter**: `HijriDateAdapter` and `provideHijriDateAdapter()`, with parsing, formats, and month names                  |
| `bb21be3` | ✨ Feature  | **Demo**: Gregorian and Umm al-Qura datepickers with locale and direction switches, a minimum, a maximum, and a Friday filter |
| `c24629b` | ✨ Feature  | **Reactive Fields**: The `/reactive` entry point, `setCalendar()`, and `formatCalendarDate()`                                 |
| `2928b60` | ✨ Feature  | **Signal Fields**: The `/signals` entry point, with the shared field code moved to the private `/internal` entry point        |
| `43db6df` | 🔧 Refactor | **Naming**: Calendar-neutral field names and `ngx-mat-` selectors, `CalendarCode` and `CalendarLocale` constants              |
| `96c901f` | 🏗️ Build    | **Workspace**: Angular 22 library workspace with the unpublished 0.0.0 package, the demo app, and CI                          |
| `680b119` | 🏗️ Build    | **Release 0.1.0**: Version bump, README, and the CHANGELOG shipped inside the package                                         |
| `6a9a5df` | 📝 Docs     | **License**: MIT license                                                                                                      |

### 📝 Summary of Changes

#### ✨ Added

- **Calendar Helpers**: `createCalendarDate`, `convertCalendarDate`, `compareCalendarDates`, `addCalendarDate`, `daysInCalendarMonth`, `monthsInCalendarYear`, and `calendarToday` for `CalendarDate` values in the Gregorian and Umm al-Qura calendars
- **Umm al-Qura Range**: Years are limited to AH 1300–1599 (`UMALQURA_MIN_YEAR`, `UMALQURA_MAX_YEAR`). Dates outside that table throw `UmalquraDateRangeError`
- **Date Adapter**: `HijriDateAdapter`, a Material `DateAdapter<CalendarDate>` that works in either calendar and switches at runtime through `setCalendar()`
- **Provider**: `provideHijriDateAdapter()` registers the adapter, `MAT_DATE_FORMATS`, and `MAT_DATE_LOCALE`. Options are `calendar`, `locale`, `timeZone`, and `formats`
- **Parsing**: `YYYY-MM-DD`, day-month-year text, month names, and Arabic-Indic and Persian digits are read in the adapter calendar, without `Date.parse`
- **Formatting**: `HIJRI_DATE_FORMATS` and `formatCalendarDate()` format a date in its own calendar for any locale
- **Constants**: `CalendarCode` and `CalendarLocale`, and the `SupportedCalendar` type
- **Reactive Fields**: `ngx-mat-hijri-adapter/reactive` with `ReactiveDateField` and `ReactiveDateRangeField`, `ControlValueAccessor` fields for reactive forms
- **Signal Fields**: `ngx-mat-hijri-adapter/signals` with `SignalDateField` and `SignalDateRangeField`, `FormValueControl` fields for signal forms
- **Field Options**: Both field entry points support a value calendar, a Hijri/Gregorian display toggle, an equivalent-date hint, `minDate` and `maxDate`, `period`, `dateFilter`, and error messages
- **Demo App**: Datepickers in both calendars and live cards for the reactive and signal fields

#### 🔧 Changed

- **Field Names**: Before the release, the fields were renamed from `HijriDateField` and `HijriSignalDateField` to `ReactiveDateField` and `SignalDateField`, and their selectors moved from `hijri-` to `ngx-mat-` (for example `ngx-mat-reactive-date-field`)
- **Shared Field Code**: `ngx-mat-hijri-adapter/internal` holds the code shared by `/reactive` and `/signals`. It is not public API and may change in any release

#### 🏗️ Build

- **Requirements**: Angular 22 or newer and `@internationalized/date` 3.12.0 or newer
- **Entry Boundaries**: `scripts/check-entry-boundaries.mjs` fails the build when an entry point imports one it may not use, such as `/reactive` importing `/signals`
- **Package Files**: The README, license, and changelog are copied into the package before each build

### 📦 Modified Files

<details>
<summary><strong>Calendar</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-date.ts` - Calendar helpers and the Umm al-Qura range checks
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/supported-calendars.ts` - `CalendarCode` and `SupportedCalendar`
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-date.spec.ts` - Helper and range tests
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-code.spec.ts` - Calendar code tests

</details>

<details>
<summary><strong>Adapter, Formats, and Locale</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter.ts` - `HijriDateAdapter` with parsing and `setCalendar()`
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter-options.ts` - Adapter options and their injection token
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/provide-hijri-date-adapter.ts` - `provideHijriDateAdapter()`
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter.spec.ts` - Adapter tests
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/provide-hijri-date-adapter.spec.ts` - Provider tests
- `projects/ngx-mat-hijri-adapter/src/lib/formats/date-formats.ts` - `HIJRI_DATE_FORMATS`
- `projects/ngx-mat-hijri-adapter/src/lib/formats/format-calendar-date.ts` - `formatCalendarDate()`
- `projects/ngx-mat-hijri-adapter/src/lib/formats/format-calendar-date.spec.ts` - Formatting tests
- `projects/ngx-mat-hijri-adapter/src/lib/locale/calendar-locale.ts` - `CalendarLocale`
- `projects/ngx-mat-hijri-adapter/src/lib/locale/month-names.ts` - Month names for parsing
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` - `NGX_MAT_HIJRI_ADAPTER_VERSION` is 0.1.0
- `projects/ngx-mat-hijri-adapter/src/public-api.ts` - Main entry point exports

</details>

<details>
<summary><strong>Reactive Fields</strong></summary>

- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.ts` - `ReactiveDateField`
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-range-field.ts` - `ReactiveDateRangeField`
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field-base.ts` - `ControlValueAccessor` base for both fields
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.spec.ts` - Date field tests
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-range-field.spec.ts` - Range field tests
- `projects/ngx-mat-hijri-adapter/reactive/src/public-api.ts` - `/reactive` exports

</details>

<details>
<summary><strong>Signal Fields</strong></summary>

- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.ts` - `SignalDateField`
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-range-field.ts` - `SignalDateRangeField`
- `projects/ngx-mat-hijri-adapter/signals/src/signal-errors.ts` - Datepicker errors as signal form parse errors, and the first error message
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.spec.ts` - Date field tests
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-range-field.spec.ts` - Range field tests
- `projects/ngx-mat-hijri-adapter/signals/src/public-api.ts` - `/signals` exports

</details>

<details>
<summary><strong>Internal</strong></summary>

- `projects/ngx-mat-hijri-adapter/internal/src/date-field-core.ts` - Calendar toggle, hint, and value handling shared by both field sets
- `projects/ngx-mat-hijri-adapter/internal/src/field-support.ts` - Value reading, range types, picker bounds, periods, and the equivalent-date text
- `projects/ngx-mat-hijri-adapter/internal/src/field-providers.ts` - Date formats that keep the app's own formats when registered
- `projects/ngx-mat-hijri-adapter/internal/src/date-field.html` - Date field template
- `projects/ngx-mat-hijri-adapter/internal/src/date-range-field.html` - Range field template
- `projects/ngx-mat-hijri-adapter/internal/src/date-field.css` - Field styles
- `projects/ngx-mat-hijri-adapter/internal/src/public-api.ts` - `ɵ`-prefixed exports

</details>

<details>
<summary><strong>Demo</strong></summary>

- `projects/demo/src/app/app.ts` - Demo shell
- `projects/demo/src/app/calendar-demo/calendar-demo.ts` - Umm al-Qura and Gregorian datepicker cards
- `projects/demo/src/app/reactive-fields-demo/reactive-fields-demo.ts` - Reactive fields card
- `projects/demo/src/app/signal-fields-demo/signal-fields-demo.ts` - Signal fields card
- `projects/demo/src/app/app.spec.ts` - Demo tests

</details>

<details>
<summary><strong>Workspace and Package</strong></summary>

- `package.json` - Version 0.1.0
- `projects/ngx-mat-hijri-adapter/package.json` - Version 0.1.0 and peer dependencies
- `projects/ngx-mat-hijri-adapter/ng-package.json` - Ships `CHANGELOG.md` with the package
- `angular.json` - Library and demo projects
- `scripts/check-entry-boundaries.mjs` - Entry point import check
- `scripts/stage-package-files.mjs` - Copies the README, license, and changelog into the package
- `.github/workflows/ci.yml` - Tests and builds on pushes to `main` and on pull requests
- `README.md` - Package documentation
- `LICENSE` - MIT license

</details>

---

**Version**: 0.1.0  
**Release Date**: October 3, 2026  
**Maintained by**: Mahmoud

---

[0.1.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.1.0
