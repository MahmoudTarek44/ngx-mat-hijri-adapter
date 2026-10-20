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

`provideHijriDateAdapter()` stores a `CalendarDate` from `@internationalized/date`. Do not store a JavaScript `Date` with that provider.

`provideNativeHijriDateAdapter()` from `ngx-mat-hijri-adapter/native` is an alternative for a plain `mat-datepicker` that must store a JavaScript `Date`. It stores that `Date` at UTC noon. 1 Ramadan 1445 is `2024-03-11T12:00:00.000Z`. A `Date` has no calendar, so `valueCalendar` and `calendarOf()` do not apply, and there is no calendar toggle on this path. Hijri month names come from `Intl` and can differ between browsers. Hijri day math uses the in-repo Umm al-Qura table, AH 1300–1599. `JSON.stringify` writes the Gregorian instant. Loading this entry still loads the main entry, so `@internationalized/date` stays installed.

The ready-made fields store a `CalendarDate` so the toggle can change the calendar on screen while `valueCalendar` stays the saved value. They do not use the native provider. Do not add `Date` fields and do not move the existing fields onto `Date`.

Both providers default to the Umm al-Qura calendar and the `ar-SA` locale. The locale does not select the calendar.

## Entry points

- `ngx-mat-hijri-adapter` exports `HijriDateAdapter`, `provideHijriDateAdapter()`, and the calendar helpers.
- `ngx-mat-hijri-adapter/native` exports `NativeHijriDateAdapter` and `provideNativeHijriDateAdapter()`.
- `ngx-mat-hijri-adapter/reactive` exports date and range fields for reactive forms.
- `ngx-mat-hijri-adapter/signals` exports the same fields for signal forms.

## Calendars

`valueCalendar` is the calendar of the stored form value. `calendarToggle` changes the calendar shown and typed in the field. Switching it leaves the stored value in `valueCalendar`. The default buttons are icons: `dark_mode` for Hijri and `add_circle_outline` for Gregorian.

A content template replaces those buttons. One icon can open a menu:

```html
<ng-template #calendarToggle let-controller>
  <button type="button" mat-icon-button [matMenuTriggerFor]="calendars" [disabled]="controller.disabled">
    <mat-icon>{{ controller.display === 'gregorian' ? 'add_circle_outline' : 'dark_mode' }}</mat-icon>
  </button>
  <mat-menu #calendars="matMenu">
    <button type="button" mat-menu-item (click)="controller.open('islamic-umalqura')">
      {{ controller.labels.hijri }}
    </button>
    <button type="button" mat-menu-item (click)="controller.open('gregorian')">
      {{ controller.labels.gregorian }}
    </button>
  </mat-menu>
</ng-template>
```

`controller.show` switches the calendar and leaves the picker closed. `controller.open` switches it and opens the picker. Neither changes the stored `CalendarDate` or marks the control dirty. `equivalentHint` still renders under the field.

The ready-made fields follow the application's Material theme. They have no style input. They inherit `--mat-sys-*` and any global datepicker or form-field tokens set on `html`. The pressed toggle uses `--mat-sys-primary` and `--mat-sys-secondary-container`. A `mat.form-field-overrides()` block on a parent of the field reaches the input. The calendar popup is an overlay, so it inherits datepicker tokens from `html`, not from the field. The calendar icon uses `toggle-icon-color`, not the form-field trailing icon color.

The package name for the Gregorian calendar is `gregorian`. A `CalendarDate` in that calendar reports `calendar.identifier === 'gregory'`. `calendarOf(date)` returns `gregorian` or `islamic-umalqura`, mapping `gregory` to `gregorian`. Any other identifier throws. It does not apply to a JavaScript `Date`.

`HijriDateAdapter.createDate` uses 0-based months, matching Material. `createDate(1445, 8, 1)` is 1 Ramadan 1445. `createCalendarDate` uses 1-based months. `createCalendarDate('islamic-umalqura', 1445, 9, 1)` is that same day.

Umm al-Qura dates stay inside AH 1300–1599. `createDate` outside that range throws. Adding a year or month past the table returns an invalid date.
