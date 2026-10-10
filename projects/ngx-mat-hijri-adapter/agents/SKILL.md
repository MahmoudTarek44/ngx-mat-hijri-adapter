---
name: ngx-mat-hijri-adapter
description: >-
  Adds Umm al-Qura and Gregorian dates to an Angular Material app with
  ngx-mat-hijri-adapter. Use when installing the package, wiring a datepicker,
  or storing Hijri or Gregorian form values.
---

# ngx-mat-hijri-adapter

## Setup

Run `ng add ngx-mat-hijri-adapter` in an Angular app that already has Angular Material. It installs this package, adds `@internationalized/date` when that package is missing, and registers `provideHijriDateAdapter()`.

If Angular Material is missing, install it first. The manual alternative is `npm install ngx-mat-hijri-adapter @internationalized/date`, then call `provideHijriDateAdapter()` from the application providers.

Do not add `@types/ngx-mat-hijri-adapter`. The package publishes its own `.d.ts` files.

## Values

Store a `CalendarDate` from `@internationalized/date`. Do not store a JavaScript `Date`.

`provideHijriDateAdapter()` defaults to the Umm al-Qura calendar and the `ar-SA` locale. The locale does not select the calendar.

## Entry points

- `ngx-mat-hijri-adapter` exports `HijriDateAdapter`, `provideHijriDateAdapter()`, and the calendar helpers.
- `ngx-mat-hijri-adapter/reactive` exports date and range fields for reactive forms.
- `ngx-mat-hijri-adapter/signals` exports the same fields for signal forms.

## Calendars

`valueCalendar` is the calendar of the stored form value. `calendarToggle` changes the calendar shown and typed in the field. Switching it leaves the stored value in `valueCalendar`.

The package name for the Gregorian calendar is `gregorian`. A `CalendarDate` in that calendar reports `calendar.identifier === 'gregory'`.

`HijriDateAdapter.createDate` uses 0-based months, matching Material. `createDate(1445, 8, 1)` is 1 Ramadan 1445. `createCalendarDate` uses 1-based months. `createCalendarDate('islamic-umalqura', 1445, 9, 1)` is that same day.

Umm al-Qura dates stay inside AH 1300–1599. `createDate` outside that range throws. Adding a year or month past the table returns an invalid date.
