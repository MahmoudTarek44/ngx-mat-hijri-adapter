# ngx-mat-hijri-adapter

Modern Angular Material date adapter for Gregorian and Umm al-Qura Hijri calendars, powered by [`@internationalized/date`](https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date).

**Version 0.0.0 is not published.** This version exports calendar helpers, `HijriDateAdapter`, `provideHijriDateAdapter()`, reactive form fields from `ngx-mat-hijri-adapter/reactive`, and signal form fields from `ngx-mat-hijri-adapter/signals`. The demo app uses both calendars in a Material datepicker and in those fields.

## Requirements

- Angular `core`, `forms`, `material`, and `cdk` 22.0.0 or newer. [Signal forms](https://angular.dev/guide/forms/signals/comparison) are stable from this version, and the package will not support Angular 21.
- `@internationalized/date` 3.12.0 or newer. `CalendarDate` is part of the public value type, so this package stays a peer dependency.
- Node.js `^22.22.3`, `^24.15.0`, or `26` or newer, to build this workspace.

## Calendar values

Calendar values are `CalendarDate` objects. A JavaScript `Date` is not a calendar value. Supported calendars are `gregorian` and `islamic-umalqura`. Umm al-Qura years are AH 1300–1599. AH 1600 is rejected because the underlying table falls back to the civil Islamic calendar.

```ts
import { createCalendarDate, convertCalendarDate } from 'ngx-mat-hijri-adapter';

const hijri = createCalendarDate('islamic-umalqura', 1445, 9, 1);
const gregorian = convertCalendarDate(hijri, 'gregorian');
```

`1445-09-01` Umm al-Qura is `2024-03-11` Gregorian. Months in these helpers are 1-indexed. `NGX_MAT_HIJRI_ADAPTER_VERSION` is `'0.0.0'`.

The package names calendars `gregorian` and `islamic-umalqura`. `@internationalized/date` reports a Gregorian `CalendarDate` with `calendar.identifier === 'gregory'`. `CalendarDate#toString()` always prints the Gregorian ISO date, even for an Umm al-Qura date, so read `year`, `month`, and `day` to get the Hijri numbers.

## Date adapter

`HijriDateAdapter` implements Material's `DateAdapter<CalendarDate>`. The configured calendar owns numeric dates. The locale chooses digits, Gregorian month names, weekday names, and the first day of the week. `ar-SA` does not select the Hijri calendar, and a Hijri calendar does not force Saturday as the week start.

`provideHijriDateAdapter()` registers the adapter, `MAT_DATE_FORMATS`, and `MAT_DATE_LOCALE`. Defaults are `islamic-umalqura`, `ar-SA`, and the runtime time zone. `today()` uses the configured time zone. Passing `locale: 'en-US'` does not switch the calendar to Gregorian, and passing `calendar: 'gregorian'` does not switch the locale away from `ar-SA`.

```ts
import { provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

providers: [provideHijriDateAdapter()];
```

A Gregorian picker with an English locale is the same provider with both options set. The locale still does not decide the calendar:

```ts
providers: [provideHijriDateAdapter({ calendar: 'gregorian', locale: 'en-US', timeZone: 'UTC' })];
```

`setCalendar('gregorian')` or `setCalendar('islamic-umalqura')` switches an adapter instance at runtime, and `calendar` reads the current one. Material redraws through `localeChanges`. After a switch, the adapter reads, formats, and clones any `CalendarDate` in its new calendar. Use it on an adapter provided to one component. The reactive fields work this way.

Material month indexes are 0-based. `createDate(1445, 8, 1)` is 1 Ramadan 1445. `createDate` throws for a month outside 0–11, a day outside that month, or an Umm al-Qura year outside 1300–1599. Adding months clamps to the last valid day, so 30 Ramadan 1445 plus one month is 29 Shawwal 1445. Adding a year or month that leaves AH 1300–1599 throws.

### Parsing

`parse` reads user text in the adapter calendar. It does not use `Date.parse`.

- `null` and blank text parse to `null`. Any other unrecognized value, including a JavaScript `Date` or a timestamp, parses to an invalid date.
- `YYYY-MM-DD` is year, month, and day in the adapter calendar. On an Umm al-Qura adapter, `1445-09-01` is 1 Ramadan 1445. `2024-03-11` is not 11 March 2024: AH 2024 is outside 1300–1599, so that text is an invalid date.
- `D/M/YYYY`, `D-M-YYYY`, and `D.M.YYYY` are day, month, and year. When the first number is greater than 31, the same separators are read as year, month, and day, so `1447/10/15` is 15 Shawwal 1447.
- `D Month YYYY` accepts the fixed English and Arabic Umm al-Qura names on an Umm al-Qura adapter. A Gregorian adapter accepts the active locale's month names instead.
- Arabic-Indic digits (`٠`–`٩`) and Persian digits (`۰`–`۹`) are accepted.
- Text outside AH 1300–1599 parses to an invalid date. `createDate` throws for the same year.

`deserialize` accepts `null`, `''`, a `CalendarDate`, or a zero-padded `YYYY-MM-DD` in the adapter calendar. `toIso8601` returns that same `YYYY-MM-DD` with ASCII digits. It is the adapter calendar's date, not a Gregorian conversion and not `Date#toISOString`.

### Formatting

`HIJRI_DATE_FORMATS` follows Material's format slots. A numeric month renders as `day/month/year`. A long, short, or narrow month renders as `day month, year`, with the Arabic comma `،` for Arabic locales. Digits follow the locale.

`formatCalendarDate(date, locale, options)` applies the same rules outside the adapter. It formats the date in its own calendar:

````ts
import { createCalendarDate, formatCalendarDate } from 'ngx-mat-hijri-adapter';

formatCalendarDate(createCalendarDate('islamic-umalqura', 1445, 9, 1), 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}); // '1 Ramadan, 1445'
``` Umm al-Qura month names are fixed: Arabic when the locale starts with `ar`, English otherwise. Gregorian month names and all weekday names come from `Intl`.

In this runtime, `en-US` and `ar-SA` start the week on Sunday, and `ar-EG` starts it on Saturday. `setLocale` updates those locale rules and does not change the calendar.

Formatting or converting an invalid date throws. Time methods are not implemented.

## Reactive form fields

`ngx-mat-hijri-adapter/reactive` exports `HijriDateField` and `HijriDateRangeField`. Each is a `ControlValueAccessor` for `formControl` or `formControlName`, wrapping a Material form field and datepicker. Each field provides its own `HijriDateAdapter`, reading calendar and locale defaults from `provideHijriDateAdapter()` when it is present.

```ts
import { HijriDateField, HijriDateRangeField, type CalendarDateRange } from 'ngx-mat-hijri-adapter/reactive';

form = new FormGroup({
  appointment: new FormControl<CalendarDate | null>(null, Validators.required),
  stay: new FormControl<CalendarDateRange>({ start: null, end: null }),
});
````

```html
<hijri-date-field
  formControlName="appointment"
  label="Appointment"
  valueCalendar="islamic-umalqura"
  calendarToggle
  [errors]="{ required: 'A date is required.', matDatepickerFilter: 'Fridays are unavailable.' }"
/>
<hijri-date-range-field
  formControlName="stay"
  label="Stay"
  valueCalendar="gregorian"
  calendarToggle
/>
```

The value of `HijriDateField` is a `CalendarDate` or `null`. The value of `HijriDateRangeField` is `{ start, end }`, and each end is a `CalendarDate` or `null`. Values are always emitted in `valueCalendar`, which defaults to the provider calendar. A written value may be in either calendar. Anything other than a `CalendarDate`, `null`, or `''` throws.

With `calendarToggle`, Hijri and Gregorian buttons replace the calendar icon. Pressing one switches the displayed and typed calendar, then opens the picker. Switching does not change the form value and does not mark the control dirty. A typed `20/3/2024` in the Gregorian view stores 10 Ramadan 1445 when `valueCalendar` is `islamic-umalqura`. With the toggle on, the hint shows the selected date in the calendar that is not displayed, such as `10 Ramadan, 1445 AH`. Set `equivalentHint` to `false` to hide it.

Other inputs:

- `label`, `placeholder` on the date field, and `startPlaceholder` and `endPlaceholder` on the range field.
- `locale` overrides the provider locale for digits, names, week start, and the default button text.
- `minDate` and `maxDate` accept a `CalendarDate` in either calendar.
- `period` is `'all'`, `'past'`, or `'future'`. `past` and `future` both exclude today.
- `dateFilter` receives each day in `valueCalendar`.
- `touchUi` opens the calendar in a dialog.
- `errors` maps validation error keys to messages. Datepicker errors such as `matDatepickerParse`, `matDatepickerMin`, `matDatepickerFilter`, and `matEndDateInvalid` are shown before the control's own errors such as `required`.
- `calendarLabels` overrides the button text and accessible names. Defaults are `هـ` and `م` for Arabic locales, and `AH` and `AD` otherwise.

Datepicker validation errors are merged into the form control's errors. When Umm al-Qura is involved, through `valueCalendar` or the toggle, the picker is limited to AH 1300–1599, so a Gregorian date outside that table reports `matDatepickerMin` or `matDatepickerMax` and the value is `null`.

## Signal form fields

`ngx-mat-hijri-adapter/signals` exports `HijriSignalDateField` and `HijriSignalDateRangeField`. They have the same template, calendar toggle, hint, and inputs as the reactive fields, and they implement `FormValueControl` for the `[formField]` directive from `@angular/forms/signals`.

```ts
import { FormField, form, required } from '@angular/forms/signals';
import {
  type CalendarDateRange,
  HijriSignalDateField,
  HijriSignalDateRangeField,
} from 'ngx-mat-hijri-adapter/signals';

booking = signal<{ appointment: CalendarDate | null; stay: CalendarDateRange }>({
  appointment: null,
  stay: { start: null, end: null },
});
form = form(this.booking, (path) => required(path.appointment));
```

```html
<hijri-signal-date-field
  [formField]="form.appointment"
  label="Appointment"
  valueCalendar="islamic-umalqura"
  calendarToggle
  [errorMessages]="{ required: 'A date is required.' }"
/>
<hijri-signal-date-range-field
  [formField]="form.stay"
  label="Stay"
  valueCalendar="gregorian"
  calendarToggle
/>
```

The model holds the same values as the reactive fields, always in `valueCalendar`. Disabled, touched, and error state come from the field. Datepicker errors such as `matDatepickerParse` and `matEndDateInvalid` are reported to the field as errors of that `kind`. As with the reactive fields, an unreadable or out-of-table date sets the model to `null`. `errorMessages` maps error kinds to messages, because `errors` is set by `[formField]`. Without an entry, the field shows the error's own `message`. Datepicker errors are shown first.

`ngx-mat-hijri-adapter/reactive` and `ngx-mat-hijri-adapter/signals` do not depend on each other. Both export `CalendarDateRange`, `HijriCalendarLabels`, and `HijriDatePeriod`. Code they share lives in `ngx-mat-hijri-adapter/internal`, which is not public API: its exports carry the `ɵ` prefix and may change in any release.

Use `minDate` and `maxDate` for picker bounds. The `min()` and `max()` signal form rules work on numbers and JavaScript `Date` values, not `CalendarDate`, and these fields do not read them.

## Demo

The demo app shows one Umm al-Qura picker and one Gregorian picker. Each picker is a reactive form control with a minimum, a maximum, and a Friday filter. Locale (`ar-SA` or `en-US`) and direction (`rtl` or `ltr`) are separate controls on each picker. Changing them does not change that picker's calendar.

A third card uses `HijriDateField` and `HijriDateRangeField` in one reactive form, with the calendar toggle on and the current form values printed below each field. A fourth card shows `HijriSignalDateField` and `HijriSignalDateRangeField` bound to one signal form.

Set direction with the CDK `Dir` directive (`[dir]` with `Dir` from `@angular/cdk/bidi` imported), or on the document root. The datepicker popup renders in an overlay outside the field, so a plain `dir` attribute on a wrapper element does not flip the popup.

## Develop

Install dependencies, build the library, then run the demo. The demo imports the built package from `dist/ngx-mat-hijri-adapter`.

```bash
npm ci
npm test
npm run build
npx ng serve demo
```

The demo dev server excludes `ngx-mat-hijri-adapter` from Vite prebundling, so a rebuilt `dist` is picked up without clearing the cache.

The production library build uses partial compilation, as required by the [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format).

## License

[MIT](LICENSE). Copyright (c) 2026 Mahmoud.
