import { CalendarDate, toCalendar, today, type DateDuration } from '@internationalized/date';

export {
  UMALQURA_MAX_YEAR,
  UMALQURA_MIN_YEAR,
  UmalquraDateRangeError,
} from './calendar-constants';

import {
  UMALQURA_MAX_YEAR,
  UMALQURA_MIN_YEAR,
  UmalquraDateRangeError,
} from './calendar-constants';
import { CalendarCode, supportedCalendar, type SupportedCalendar } from './supported-calendars';

export class InvalidCalendarDateError extends Error {
  constructor(calendar: SupportedCalendar, year: number, month: number, day: number) {
    super(`Invalid ${calendar} date ${year}-${month}-${day}.`);
    this.name = 'InvalidCalendarDateError';
  }
}

export function createCalendarDate(
  calendar: SupportedCalendar,
  year: number,
  month: number,
  day: number,
): CalendarDate {
  if (calendar === CalendarCode.umalqura) {
    assertUmalquraYear(year);
  }

  const date = new CalendarDate(supportedCalendar(calendar), year, month, day);
  if (date.year !== year || date.month !== month || date.day !== day) {
    throw new InvalidCalendarDateError(calendar, year, month, day);
  }

  return date;
}

export function convertCalendarDate(date: CalendarDate, calendar: SupportedCalendar): CalendarDate {
  const converted = toCalendar(date, supportedCalendar(calendar));
  if (calendar === CalendarCode.umalqura) {
    assertUmalquraYear(converted.year);
  }

  return converted;
}

export function compareCalendarDates(left: CalendarDate, right: CalendarDate): number {
  return left.compare(right);
}

export function addCalendarDate(date: CalendarDate, duration: DateDuration): CalendarDate {
  const next = date.add(duration);
  if (next.calendar.identifier === CalendarCode.umalqura) {
    assertUmalquraYear(next.year);
  }

  return next;
}

export function daysInCalendarMonth(date: CalendarDate): number {
  return date.calendar.getDaysInMonth(date);
}

export function monthsInCalendarYear(date: CalendarDate): number {
  return date.calendar.getMonthsInYear(date);
}

export function calendarToday(calendar: SupportedCalendar, timeZone: string): CalendarDate {
  return convertCalendarDate(today(timeZone), calendar);
}

function assertUmalquraYear(year: number): void {
  if (year < UMALQURA_MIN_YEAR || year > UMALQURA_MAX_YEAR) {
    throw new UmalquraDateRangeError(year);
  }
}
