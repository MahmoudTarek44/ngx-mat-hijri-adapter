# ngx-mat-hijri-adapter

Modern Angular Material date adapter for Gregorian and Umm al-Qura Hijri calendars, powered by [`@internationalized/date`](https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date).

**Version 0.0.0 is not published.** This version exports calendar helpers, `HijriDateAdapter`, and `provideHijriDateAdapter()`. The demo datepicker and the `reactive` and `signals` entry points are not included.

## Requirements

- Angular `core`, `material`, and `cdk` 22.0.0 or newer. [Signal forms](https://angular.dev/guide/forms/signals/comparison) are stable from this version, and the package will not support Angular 21.
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

`HIJRI_DATE_FORMATS` follows Material's format slots. A numeric month renders as `day/month/year`. A long, short, or narrow month renders as `day month, year`. Digits follow the locale. Umm al-Qura month names are fixed: Arabic when the locale starts with `ar`, English otherwise. Gregorian month names and all weekday names come from `Intl`.

In this runtime, `en-US` and `ar-SA` start the week on Sunday, and `ar-EG` starts it on Saturday. `setLocale` updates those locale rules and does not change the calendar.

Formatting or converting an invalid date throws. Time methods are not implemented.

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
