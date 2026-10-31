/*
 * Public API Surface of ngx-mat-hijri-adapter
 */

export { CalendarCode, type SupportedCalendar } from './lib/calendar/supported-calendars';
export { formatCalendarDate } from './lib/formats/format-calendar-date';
export { HijriDateAdapter } from './lib/adapter/hijri-date-adapter';
export { NGX_MAT_HIJRI_ADAPTER_VERSION } from './lib/version';
export { CalendarLocale } from './lib/locale/calendar-locale';
export {
  type ProvideHijriDateAdapterOptions,
  provideHijriDateAdapter,
} from './lib/adapter/provide-hijri-date-adapter';
export {
  type HijriDateAdapterOptions,
  HIJRI_DATE_ADAPTER_OPTIONS,
} from './lib/adapter/hijri-date-adapter-options';
export {
  InvalidCalendarDateError,
  UmalquraDateRangeError,
  compareCalendarDates,
  monthsInCalendarYear,
  convertCalendarDate,
  daysInCalendarMonth,
  createCalendarDate,
  UMALQURA_MIN_YEAR,
  UMALQURA_MAX_YEAR,
  addCalendarDate,
  calendarToday,
  calendarOf,
} from './lib/calendar/calendar-date';
export {
  type DateDisplayFormat,
  MONTH_NAME_DATE_INPUT,
  HIJRI_DATE_FORMATS,
  NUMERIC_DATE_INPUT,
  dateInputOptions,
} from './lib/formats/date-formats';
