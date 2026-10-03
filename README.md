# ngx-mat-hijri-adapter

Angular Material date adapter and form fields for the Gregorian and Umm al-Qura Hijri calendars, powered by [`@internationalized/date`](https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date).

- One `DateAdapter` for both calendars, switchable at runtime.
- Locale is independent of calendar: an English Hijri picker or an Arabic Gregorian picker both work.
- Ready-made date and date range fields for reactive forms and for signal forms.
- An optional Hijri/Gregorian toggle on each field, with a hint showing the date in the other calendar.
- Right-to-left support through the CDK `Dir` directive.

The package and its adapter carry "Hijri" in their names, but every part handles both calendars. The field components carry no calendar in their names: `ReactiveDateField` and `SignalDateField` work in either.

## Status and installation

Version 0.1.0 is tagged on [GitHub](https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/v0.1.0). It is not yet published to npm. Once it is, install it with its peer dependencies:

```bash
npm install ngx-mat-hijri-adapter @internationalized/date
```

Angular `core`, `forms`, `material`, and `cdk` are also peer dependencies and are expected to be in the app already.

## Requirements

- Angular `core`, `forms`, `material`, and `cdk` 22.0.0 or newer. [Signal forms](https://angular.dev/guide/forms/signals/comparison) are stable from this version, and the package does not support Angular 21.
- `@internationalized/date` 3.12.0 or newer. `CalendarDate` is part of the public value type, so it is a peer dependency.

## Quick start

Register the adapter once, in the application providers. The defaults are the Umm al-Qura calendar and the `ar-SA` locale.

```ts
import { provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

bootstrapApplication(App, {
  providers: [provideHijriDateAdapter()],
});
```

A plain Material datepicker now works with `CalendarDate` values:

```html
<mat-form-field>
  <mat-label>Date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="date" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>
```

```ts
date = new FormControl<CalendarDate | null>(null);
```

Or use a ready-made field, which adds the calendar toggle and error messages:

```ts
import { ReactiveDateField } from 'ngx-mat-hijri-adapter/reactive';
```

```html
<ngx-mat-reactive-date-field [formControl]="date" label="Date" calendarToggle />
```

## Calendar values and constants

Calendar values are `CalendarDate` objects from `@internationalized/date`. A JavaScript `Date` is not a calendar value. The supported calendars are `gregorian` and `islamic-umalqura`.

```ts
import { CalendarCode, convertCalendarDate, createCalendarDate } from 'ngx-mat-hijri-adapter';

const hijri = createCalendarDate(CalendarCode.umalqura, 1445, 9, 1);
const gregorian = convertCalendarDate(hijri, CalendarCode.gregorian); // 2024-03-11
```

Months in these helpers are 1-indexed, so `1445-09-01` is 1 Ramadan 1445.

`CalendarCode` names the supported calendars: `CalendarCode.gregorian` is `'gregorian'` and `CalendarCode.umalqura` is `'islamic-umalqura'`. `SupportedCalendar` is the type of its values. `CalendarLocale` holds the locales used as defaults, `CalendarLocale.arSA` (`'ar-SA'`) and `CalendarLocale.enUS` (`'en-US'`). Any BCP 47 locale works wherever a locale is accepted.

Umm al-Qura years are limited to AH 1300–1599 (`UMALQURA_MIN_YEAR` and `UMALQURA_MAX_YEAR`). AH 1600 is rejected because the underlying table falls back to the civil Islamic calendar there. Creating, converting, or adding to a date outside that range throws `UmalquraDateRangeError`.

## Date adapter

### Configuration

`HijriDateAdapter` implements Material's `DateAdapter<CalendarDate>`. `provideHijriDateAdapter()` registers it together with `MAT_DATE_FORMATS` and `MAT_DATE_LOCALE`. Its options are:

- `calendar`: `'gregorian'` or `'islamic-umalqura'`. Defaults to `islamic-umalqura`.
- `locale`: digits, Gregorian month names, weekday names, and the first day of the week. Defaults to `ar-SA`.
- `timeZone`: used by `today()`. Defaults to the runtime time zone.
- `formats`: Material format slots. Defaults to `HIJRI_DATE_FORMATS`.

Calendar and locale are independent. `ar-SA` does not select the Hijri calendar, `en-US` does not select Gregorian, and a Hijri calendar does not force Saturday as the week start. A Gregorian picker with an English locale sets both options:

```ts
import { CalendarCode, CalendarLocale, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

providers: [
  provideHijriDateAdapter({
    calendar: CalendarCode.gregorian,
    locale: CalendarLocale.enUS,
    timeZone: 'UTC',
  }),
];
```

In this runtime, `en-US` and `ar-SA` start the week on Sunday, and `ar-EG` starts it on Saturday. `setLocale` updates those locale rules and does not change the calendar.

### Switching calendars

`setCalendar('gregorian')` or `setCalendar('islamic-umalqura')` switches an adapter instance at runtime, and `calendar` reads the current one. Material redraws through `localeChanges`. After a switch, the adapter reads, formats, and clones any `CalendarDate` in its new calendar. Use it on an adapter provided to a single component, as the form fields do.

### Month indexing

Material month indexes are 0-based. `createDate(1445, 8, 1)` is 1 Ramadan 1445. `createDate` throws for a month outside 0–11, a day outside that month, or an Umm al-Qura year outside 1300–1599. Adding months clamps to the last valid day, so 30 Ramadan 1445 plus one month is 29 Shawwal 1445. Adding a year or month that leaves AH 1300–1599 throws.

### Parsing

`parse` reads user text in the adapter calendar. It does not use `Date.parse`.

- `null` and blank text parse to `null`. Any other unrecognized value, including a JavaScript `Date` or a timestamp, parses to an invalid date.
- `YYYY-MM-DD` is year, month, and day in the adapter calendar. On an Umm al-Qura adapter, `1445-09-01` is 1 Ramadan 1445. `2024-03-11` is not 11 March 2024: AH 2024 is outside 1300–1599, so that text is an invalid date.
- `D/M/YYYY`, `D-M-YYYY`, and `D.M.YYYY` are day, month, and year. When the first number is greater than 31, the same separators are read as year, month, and day, so `1447/10/15` is 15 Shawwal 1447.
- `D Month YYYY` accepts the fixed English and Arabic Umm al-Qura month names on an Umm al-Qura adapter. A Gregorian adapter accepts the active locale's month names instead.
- Arabic-Indic digits (`٠`–`٩`) and Persian digits (`۰`–`۹`) are accepted.
- Text outside AH 1300–1599 parses to an invalid date.

`deserialize` accepts `null`, `''`, a `CalendarDate`, or a zero-padded `YYYY-MM-DD` in the adapter calendar. `toIso8601` returns that same `YYYY-MM-DD` with ASCII digits. It is the adapter calendar's date, not a Gregorian conversion and not `Date#toISOString`.

### Formatting

`HIJRI_DATE_FORMATS` follows Material's format slots. A numeric month renders as `day/month/year`. A long, short, or narrow month renders as `day month, year`, with the Arabic comma `،` for Arabic locales. Digits follow the locale.

`formatCalendarDate(date, locale, options)` applies the same rules outside the adapter, formatting the date in its own calendar:

```ts
import { createCalendarDate, formatCalendarDate } from 'ngx-mat-hijri-adapter';

formatCalendarDate(createCalendarDate('islamic-umalqura', 1445, 9, 1), 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}); // '1 Ramadan, 1445'
```

Umm al-Qura month names are fixed: Arabic when the locale starts with `ar`, English otherwise. Gregorian month names and all weekday names come from `Intl`.

## Form fields

The fields wrap a Material form field and datepicker. There are two sets with the same template and inputs:

- `ngx-mat-hijri-adapter/reactive` for reactive forms (`formControl`, `formControlName`).
- `ngx-mat-hijri-adapter/signals` for signal forms (`[formField]`).

Each field provides its own `HijriDateAdapter`, reading the calendar and locale defaults from `provideHijriDateAdapter()` when it is present.

### Shared concepts

The value of a date field is a `CalendarDate` or `null`. The value of a range field is `{ start, end }` (`CalendarDateRange`), and each end is a `CalendarDate` or `null`. Values are always emitted in `valueCalendar`, which defaults to the provider calendar. A written value may be in either calendar. Anything other than a `CalendarDate`, `null`, or `''` throws.

With `calendarToggle`, Hijri and Gregorian buttons replace the calendar icon. Pressing one switches the displayed and typed calendar, then opens the picker. Switching does not change the form value and does not mark the control dirty. A typed `20/3/2024` in the Gregorian view stores 10 Ramadan 1445 when `valueCalendar` is `islamic-umalqura`.

With the toggle on, the hint shows the selected date in the calendar that is not displayed, such as `10 Ramadan, 1445 AH`. Set `equivalentHint` to `false` to hide it.

Inputs shared by all four fields:

- `label`, plus `placeholder` on date fields, and `startPlaceholder` and `endPlaceholder` on range fields.
- `valueCalendar`, `calendarToggle`, and `equivalentHint`, described above.
- `locale` overrides the provider locale for digits, names, week start, and the default button text.
- `minDate` and `maxDate` accept a `CalendarDate` in either calendar.
- `period` is `'all'`, `'past'`, or `'future'`. `past` and `future` both exclude today.
- `dateFilter` receives each day in `valueCalendar`.
- `touchUi` opens the calendar in a dialog.
- `calendarLabels` overrides the button text and accessible names. Defaults are `هـ` and `م` for Arabic locales, and `AH` and `AD` otherwise.

When Umm al-Qura is involved, through `valueCalendar` or the toggle, the picker is limited to AH 1300–1599. A Gregorian date outside that table reports `matDatepickerMin` or `matDatepickerMax`, and the value is `null`. An unreadable date also sets the value to `null`.

### Reactive fields

`ReactiveDateField` and `ReactiveDateRangeField` are `ControlValueAccessor`s.

```ts
import {
  ReactiveDateField,
  ReactiveDateRangeField,
  type CalendarDateRange,
} from 'ngx-mat-hijri-adapter/reactive';

form = new FormGroup({
  appointment: new FormControl<CalendarDate | null>(null, Validators.required),
  stay: new FormControl<CalendarDateRange>({ start: null, end: null }),
});
```

```html
<ngx-mat-reactive-date-field
  formControlName="appointment"
  label="Appointment"
  valueCalendar="islamic-umalqura"
  calendarToggle
  [errors]="{ required: 'A date is required.', matDatepickerFilter: 'Fridays are unavailable.' }"
/>
<ngx-mat-reactive-date-range-field
  formControlName="stay"
  label="Stay"
  valueCalendar="gregorian"
  calendarToggle
/>
```

`errors` maps validation error keys to messages. Datepicker validation errors are merged into the form control's errors. Datepicker errors such as `matDatepickerParse`, `matDatepickerMin`, `matDatepickerFilter`, and `matEndDateInvalid` are shown before the control's own errors such as `required`.

### Signal fields

`SignalDateField` and `SignalDateRangeField` implement `FormValueControl` for the `[formField]` directive from `@angular/forms/signals`.

```ts
import { FormField, form, required } from '@angular/forms/signals';
import {
  SignalDateField,
  SignalDateRangeField,
  type CalendarDateRange,
} from 'ngx-mat-hijri-adapter/signals';

booking = signal<{ appointment: CalendarDate | null; stay: CalendarDateRange }>({
  appointment: null,
  stay: { start: null, end: null },
});
form = form(this.booking, (path) => required(path.appointment));
```

```html
<ngx-mat-signal-date-field
  [formField]="form.appointment"
  label="Appointment"
  valueCalendar="islamic-umalqura"
  calendarToggle
  [errorMessages]="{ required: 'A date is required.' }"
/>
<ngx-mat-signal-date-range-field
  [formField]="form.stay"
  label="Stay"
  valueCalendar="gregorian"
  calendarToggle
/>
```

Disabled, touched, and error state come from the field. Datepicker errors such as `matDatepickerParse` and `matEndDateInvalid` are reported to the field as errors of that `kind`. `errorMessages` maps error kinds to messages, because `errors` is set by `[formField]`. Without an entry, the field shows the error's own `message`. Datepicker errors are shown first.

Use `minDate` and `maxDate` for picker bounds. The `min()` and `max()` signal form rules work on numbers and JavaScript `Date` values, not `CalendarDate`, and these fields do not read them.

## Right-to-left

Set direction with the CDK `Dir` directive (`[dir]`, with `Dir` from `@angular/cdk/bidi` imported), or on the document root. The datepicker popup renders in an overlay outside the field, so a plain `dir` attribute on a wrapper element does not flip the popup.

## API overview

`ngx-mat-hijri-adapter`:

- `HijriDateAdapter`, `provideHijriDateAdapter`, `ProvideHijriDateAdapterOptions`, `HIJRI_DATE_ADAPTER_OPTIONS`, `HijriDateAdapterOptions`.
- `HIJRI_DATE_FORMATS`, `formatCalendarDate`.
- `CalendarCode`, `SupportedCalendar`, `CalendarLocale`.
- `createCalendarDate`, `convertCalendarDate`, `compareCalendarDates`, `addCalendarDate`, `daysInCalendarMonth`, `monthsInCalendarYear`, `calendarToday`.
- `UMALQURA_MIN_YEAR`, `UMALQURA_MAX_YEAR`, `UmalquraDateRangeError`, `InvalidCalendarDateError`.
- `NGX_MAT_HIJRI_ADAPTER_VERSION`.

`ngx-mat-hijri-adapter/reactive`: `ReactiveDateField`, `ReactiveDateRangeField`, `CalendarDateRange`, `DateFieldLabels`, `DateFieldPeriod`.

`ngx-mat-hijri-adapter/signals`: `SignalDateField`, `SignalDateRangeField`, `CalendarDateRange`, `DateFieldLabels`, `DateFieldPeriod`.

`/reactive` and `/signals` do not depend on each other. The code they share lives in `ngx-mat-hijri-adapter/internal`, which is private: its exports carry the `ɵ` prefix and may change in any release. Do not import from it.

## Gotchas

- `@internationalized/date` reports a Gregorian `CalendarDate` with `calendar.identifier === 'gregory'`, while this package names the calendar `gregorian`.
- `CalendarDate#toString()` always prints the Gregorian ISO date, even for an Umm al-Qura date. Read `year`, `month`, and `day` to get the Hijri numbers.
- Material adapter months are 0-based (`createDate(1445, 8, 1)` is Ramadan). The calendar helpers are 1-based (`createCalendarDate('islamic-umalqura', 1445, 9, 1)` is Ramadan).
- Formatting or converting an invalid date throws. Time methods are not implemented.

## Demo and development

The demo app shows an Umm al-Qura picker and a Gregorian picker, each with its own locale and direction controls, a minimum, a maximum, and a Friday filter. Two more cards show the reactive fields and the signal fields with the calendar toggle on and the current form values printed below each field.

Building this workspace needs Node.js `^22.22.3`, `^24.15.0`, or `26` or newer. The demo imports the built package from `dist/ngx-mat-hijri-adapter`, so build the library first:

```bash
npm ci
npm test
npm run build
npm start
```

The demo dev server excludes `ngx-mat-hijri-adapter` from Vite prebundling, so a rebuilt `dist` is picked up without clearing the cache. The production library build uses partial compilation, as required by the [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE). Copyright (c) 2026 Mahmoud.
