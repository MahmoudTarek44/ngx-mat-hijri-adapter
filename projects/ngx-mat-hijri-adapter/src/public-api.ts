/*
 * Public API Surface of ngx-mat-hijri-adapter
 */

export { NGX_MAT_HIJRI_ADAPTER_VERSION } from './lib/version';
export { CalendarCode, type SupportedCalendar } from './lib/calendar/supported-calendars';
export { CalendarLocale } from './lib/locale/calendar-locale';
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
export {
  HIJRI_DATE_FORMATS,
  MONTH_NAME_DATE_INPUT,
  NUMERIC_DATE_INPUT,
  dateInputOptions,
  type DateDisplayFormat,
} from './lib/formats/date-formats';
export { formatCalendarDate } from './lib/formats/format-calendar-date';
export {
  provideHijriDateAdapter,
  type ProvideHijriDateAdapterOptions,
} from './lib/adapter/provide-hijri-date-adapter';
