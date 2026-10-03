# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-03

First release.

### Added

- Calendar helpers for `CalendarDate` values in the Gregorian and Umm al-Qura calendars: `createCalendarDate`, `convertCalendarDate`, `compareCalendarDates`, `addCalendarDate`, `daysInCalendarMonth`, `monthsInCalendarYear`, and `calendarToday`. Umm al-Qura is limited to AH 1300–1599 (`UMALQURA_MIN_YEAR`, `UMALQURA_MAX_YEAR`), and dates outside that table throw `UmalquraDateRangeError`.
- `HijriDateAdapter`, a Material `DateAdapter<CalendarDate>` that works in either calendar, with runtime switching through `setCalendar()`.
- `provideHijriDateAdapter()`, which registers the adapter, `MAT_DATE_FORMATS`, and `MAT_DATE_LOCALE`. Options are `calendar`, `locale`, `timeZone`, and `formats`.
- Parsing of `YYYY-MM-DD`, day-month-year text, month names, and Arabic-Indic and Persian digits in the adapter calendar, without `Date.parse`.
- `HIJRI_DATE_FORMATS` and `formatCalendarDate()` for locale-aware formatting in a date's own calendar.
- `CalendarCode` and `CalendarLocale` constants, and the `SupportedCalendar` type.
- `ngx-mat-hijri-adapter/reactive`: `ReactiveDateField` and `ReactiveDateRangeField`, `ControlValueAccessor` fields for reactive forms.
- `ngx-mat-hijri-adapter/signals`: `SignalDateField` and `SignalDateRangeField`, `FormValueControl` fields for signal forms.
- Both field entry points support a value calendar, a Hijri/Gregorian display toggle, an equivalent-date hint, `minDate`/`maxDate`, `period`, `dateFilter`, and error messages.
- Requires Angular 22 or newer and `@internationalized/date` 3.12.0 or newer.

`ngx-mat-hijri-adapter/internal` holds code shared by the field entry points. It is not public API and may change in any release.

[0.1.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.1.0
