/*
 * Public API Surface of ngx-mat-hijri-adapter
 */

export { NGX_MAT_HIJRI_ADAPTER_VERSION } from './lib/version';
export type { SupportedCalendar } from './lib/calendar/supported-calendars';
export {
  UMALQURA_MAX_YEAR,
  UMALQURA_MIN_YEAR,
  InvalidCalendarDateError,
  UmalquraDateRangeError,
  addCalendarDate,
  calendarToday,
  compareCalendarDates,
  convertCalendarDate,
  createCalendarDate,
  daysInCalendarMonth,
  monthsInCalendarYear,
} from './lib/calendar/calendar-date';
export { HijriDateAdapter } from './lib/adapter/hijri-date-adapter';
export {
  HIJRI_DATE_ADAPTER_OPTIONS,
  type HijriDateAdapterOptions,
} from './lib/adapter/hijri-date-adapter-options';
export { HIJRI_DATE_FORMATS } from './lib/formats/date-formats';
export { formatCalendarDate } from './lib/formats/format-calendar-date';
export {
  provideHijriDateAdapter,
  type ProvideHijriDateAdapterOptions,
} from './lib/adapter/provide-hijri-date-adapter';
