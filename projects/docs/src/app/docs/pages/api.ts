import { Component } from '@angular/core';

interface ApiEntry {
  name: string;
  kind: string;
  description: string;
}

interface ApiGroup {
  entryPoint: string;
  summary: string;
  entries: readonly ApiEntry[];
}

const FIELD_TYPES: readonly ApiEntry[] = [
  { name: 'CalendarDateRange', kind: 'type', description: 'The value of a range field.' },
  { name: 'DateFieldLabels', kind: 'type', description: 'Button text and accessible names.' },
  { name: 'DateFieldPeriod', kind: 'type', description: "'all', 'past', or 'future'." },
];

const GROUPS: readonly ApiGroup[] = [
  {
    entryPoint: 'ngx-mat-hijri-adapter',
    summary: 'The adapter, its provider, formatting, and calendar helpers.',
    entries: [
      {
        name: 'HijriDateAdapter',
        kind: 'class',
        description: 'Material DateAdapter for both calendars.',
      },
      {
        name: 'provideHijriDateAdapter',
        kind: 'function',
        description: 'Registers the adapter, formats, and locale.',
      },
      {
        name: 'ProvideHijriDateAdapterOptions',
        kind: 'type',
        description: 'Provider options, including formats.',
      },
      {
        name: 'HIJRI_DATE_ADAPTER_OPTIONS',
        kind: 'token',
        description: 'Adapter options: calendar, locale, timeZone.',
      },
      {
        name: 'HijriDateAdapterOptions',
        kind: 'type',
        description: 'The shape of the adapter options.',
      },
      {
        name: 'HIJRI_DATE_FORMATS',
        kind: 'constant',
        description: 'Default Material format slots.',
      },
      {
        name: 'formatCalendarDate',
        kind: 'function',
        description: 'Formats a date in its own calendar.',
      },
      { name: 'CalendarCode', kind: 'constant', description: 'The supported calendar names.' },
      {
        name: 'SupportedCalendar',
        kind: 'type',
        description: "'gregorian' or 'islamic-umalqura'.",
      },
      {
        name: 'CalendarLocale',
        kind: 'constant',
        description: 'The default locales, ar-SA and en-US.',
      },
      {
        name: 'createCalendarDate',
        kind: 'function',
        description: 'Creates a validated date. Months are 1-based.',
      },
      {
        name: 'convertCalendarDate',
        kind: 'function',
        description: 'Converts a date to another calendar.',
      },
      { name: 'compareCalendarDates', kind: 'function', description: 'Orders two dates.' },
      {
        name: 'addCalendarDate',
        kind: 'function',
        description: 'Adds a duration, keeping the Umm al-Qura range.',
      },
      {
        name: 'daysInCalendarMonth',
        kind: 'function',
        description: 'Days in the month of a date.',
      },
      {
        name: 'monthsInCalendarYear',
        kind: 'function',
        description: 'Months in the year of a date.',
      },
      {
        name: 'calendarToday',
        kind: 'function',
        description: 'Today in a calendar and time zone.',
      },
      { name: 'UMALQURA_MIN_YEAR', kind: 'constant', description: '1300.' },
      { name: 'UMALQURA_MAX_YEAR', kind: 'constant', description: '1599.' },
      {
        name: 'UmalquraDateRangeError',
        kind: 'class',
        description: 'Thrown outside AH 1300–1599.',
      },
      {
        name: 'InvalidCalendarDateError',
        kind: 'class',
        description: 'Thrown for a day that does not exist.',
      },
      {
        name: 'NGX_MAT_HIJRI_ADAPTER_VERSION',
        kind: 'constant',
        description: 'The package version.',
      },
    ],
  },
  {
    entryPoint: 'ngx-mat-hijri-adapter/native',
    summary: 'A DateAdapter<Date> that formats with Intl and counts Umm al-Qura days from an in-repo table.',
    entries: [
      {
        name: 'NativeHijriDateAdapter',
        kind: 'class',
        description: 'Material DateAdapter for a JavaScript Date at UTC noon.',
      },
      {
        name: 'provideNativeHijriDateAdapter',
        kind: 'function',
        description: 'Registers the native adapter, formats, and locale.',
      },
      {
        name: 'ProvideNativeHijriDateAdapterOptions',
        kind: 'type',
        description: 'Provider options, including formats.',
      },
      {
        name: 'NativeHijriDateAdapterOptions',
        kind: 'type',
        description: 'Calendar, locale, week start, and time zone.',
      },
      {
        name: 'NATIVE_HIJRI_DATE_ADAPTER_OPTIONS',
        kind: 'constant',
        description: 'Injection token for the native adapter options.',
      },
    ],
  },
  {
    entryPoint: 'ngx-mat-hijri-adapter/reactive',
    summary: 'Fields for reactive forms.',
    entries: [
      { name: 'ReactiveDateField', kind: 'component', description: 'ngx-mat-reactive-date-field' },
      {
        name: 'ReactiveDateRangeField',
        kind: 'component',
        description: 'ngx-mat-reactive-date-range-field',
      },
      ...FIELD_TYPES,
    ],
  },
  {
    entryPoint: 'ngx-mat-hijri-adapter/signals',
    summary: 'Fields for signal forms.',
    entries: [
      { name: 'SignalDateField', kind: 'component', description: 'ngx-mat-signal-date-field' },
      {
        name: 'SignalDateRangeField',
        kind: 'component',
        description: 'ngx-mat-signal-date-range-field',
      },
      ...FIELD_TYPES,
    ],
  },
];

@Component({
  selector: 'api-reference',
  templateUrl: './api.html',
})
export class ApiReference {
  protected readonly groups = GROUPS;
}
