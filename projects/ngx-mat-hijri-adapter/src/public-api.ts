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
