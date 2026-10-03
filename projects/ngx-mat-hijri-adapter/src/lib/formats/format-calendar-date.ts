import type { CalendarDate } from '@internationalized/date';

import { CalendarCode, type SupportedCalendar } from '../calendar/supported-calendars';
import { umalquraMonthNames } from '../locale/month-names';

/**
 * Formats a date in its own calendar.
 * A numeric month renders as `day/month/year`. A named month renders as `day month, year`,
 * with an Arabic comma for Arabic locales.
 */
export function formatCalendarDate(
  date: CalendarDate,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const calendar: SupportedCalendar =
    date.calendar.identifier === CalendarCode.umalqura
      ? CalendarCode.umalqura
      : CalendarCode.gregorian;
  const day = options.day ? formatNumber(date.day, locale) : '';
  const year = options.year ? formatNumber(date.year, locale) : '';
  const month = formatMonth(calendar, locale, date.month, options.month);
  const numericMonth = options.month === 'numeric' || options.month === '2-digit';

  if (day && month && year) {
    const comma = locale.toLowerCase().startsWith('ar') ? '،' : ',';
    return numericMonth ? `${day}/${month}/${year}` : `${day} ${month}${comma} ${year}`;
  }

  if (month && year) {
    return `${month} ${year}`;
  }

  if (day && month) {
    return `${day} ${month}`;
  }

  return day || month || year;
}

export function calendarMonthNames(
  calendar: SupportedCalendar,
  locale: string,
  style: 'long' | 'short' | 'narrow',
): string[] {
  if (calendar === CalendarCode.umalqura) {
    return umalquraMonthNames(locale, style);
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    month: style,
    timeZone: 'UTC',
    calendar: 'gregory',
  });
  return Array.from({ length: 12 }, (_, month) =>
    formatter.format(new Date(Date.UTC(2024, month, 1))),
  );
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(value);
}

function formatMonth(
  calendar: SupportedCalendar,
  locale: string,
  month: number,
  style: Intl.DateTimeFormatOptions['month'],
): string {
  if (!style) {
    return '';
  }

  if (style === 'numeric' || style === '2-digit') {
    const text = formatNumber(month, locale);
    return style === '2-digit' && /^\d+$/.test(text) ? text.padStart(2, '0') : text;
  }

  const names = calendarMonthNames(
    calendar,
    locale,
    style === 'long' || style === 'short' || style === 'narrow' ? style : 'long',
  );
  return names[month - 1] ?? '';
}
