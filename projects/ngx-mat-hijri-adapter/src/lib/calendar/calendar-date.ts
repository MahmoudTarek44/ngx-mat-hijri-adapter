import {
  CalendarDate,
  toCalendar,
  today,
  type DateDuration,
} from '@internationalized/date';

import { supportedCalendar, type SupportedCalendar } from './supported-calendars';

/** Adobe's Umm al-Qura table includes AH 1300–1600, and AH 1600 falls back to the civil calendar. */
export const UMALQURA_MIN_YEAR = 1300;
export const UMALQURA_MAX_YEAR = 1599;

export class UmalquraDateRangeError extends Error {
  constructor(year: number) {
    super(
      `Hijri year ${year} is outside the Umm al-Qura table (${UMALQURA_MIN_YEAR}–${UMALQURA_MAX_YEAR}).`,
    );
    this.name = 'UmalquraDateRangeError';
  }
}

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
  if (calendar === 'islamic-umalqura') {
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
  if (calendar === 'islamic-umalqura') {
    assertUmalquraYear(converted.year);
  }

  return converted;
}

export function compareCalendarDates(left: CalendarDate, right: CalendarDate): number {
  return left.compare(right);
}

export function addCalendarDate(date: CalendarDate, duration: DateDuration): CalendarDate {
  const next = date.add(duration);
  if (next.calendar.identifier === 'islamic-umalqura') {
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
