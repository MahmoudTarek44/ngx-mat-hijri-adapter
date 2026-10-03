import { CalendarDate } from '@internationalized/date';
import {
  HIJRI_DATE_FORMATS,
  UMALQURA_MAX_YEAR,
  UMALQURA_MIN_YEAR,
  convertCalendarDate,
  createCalendarDate,
  daysInCalendarMonth,
  formatCalendarDate,
  type SupportedCalendar,
} from 'ngx-mat-hijri-adapter';

/** Which days a field offers relative to today. `past` and `future` both exclude today. */
export type HijriDatePeriod = 'all' | 'past' | 'future';

/** Text for the calendar toggle buttons and the equivalent-date hint. */
export interface HijriCalendarLabels {
  hijri: string;
  gregorian: string;
  hijriAriaLabel: string;
  gregorianAriaLabel: string;
}

const ARABIC_LABELS: HijriCalendarLabels = {
  hijri: 'هـ',
  gregorian: 'م',
  hijriAriaLabel: 'التقويم الهجري',
  gregorianAriaLabel: 'التقويم الميلادي',
};

const ENGLISH_LABELS: HijriCalendarLabels = {
  hijri: 'AH',
  gregorian: 'AD',
  hijriAriaLabel: 'Hijri calendar',
  gregorianAriaLabel: 'Gregorian calendar',
};

const UMALQURA_FIRST_DAY = createCalendarDate('islamic-umalqura', UMALQURA_MIN_YEAR, 1, 1);
const UMALQURA_LAST_DAY = lastDayOfYear(UMALQURA_MAX_YEAR);

export function calendarLabels(
  locale: string,
  overrides: Partial<HijriCalendarLabels>,
): HijriCalendarLabels {
  const arabic = locale.toLowerCase().startsWith('ar');
  return { ...(arabic ? ARABIC_LABELS : ENGLISH_LABELS), ...overrides };
}

export function otherCalendar(calendar: SupportedCalendar): SupportedCalendar {
  return calendar === 'gregorian' ? 'islamic-umalqura' : 'gregorian';
}

/** Converts a date, or returns null when the target calendar cannot represent it. */
export function convertOrNull(
  date: CalendarDate | null,
  calendar: SupportedCalendar,
): CalendarDate | null {
  if (!date) {
    return null;
  }

  try {
    return convertCalendarDate(date, calendar);
  } catch {
    return null;
  }
}

/** Reads a form value. Empty values are null, and anything else must be a `CalendarDate`. */
export function readCalendarDate(value: unknown, field: string): CalendarDate | null {
  if (value == null || value === '') {
    return null;
  }

  if (value instanceof CalendarDate) {
    return value;
  }

  throw new TypeError(`${field}: expected a CalendarDate or null, got ${String(value)}.`);
}

export function sameValue(left: CalendarDate | null, right: CalendarDate | null): boolean {
  if (!left || !right) {
    return left === right;
  }

  return left.calendar.identifier === right.calendar.identifier && left.compare(right) === 0;
}

/**
 * The tighter of the caller's bound and the Umm al-Qura table, in the displayed calendar.
 * The table applies whenever either calendar involved is Umm al-Qura.
 */
export function pickerBound(
  edge: 'min' | 'max',
  bound: CalendarDate | null | undefined,
  display: SupportedCalendar,
  umalqura: boolean,
): CalendarDate | null {
  const table = edge === 'min' ? UMALQURA_FIRST_DAY : UMALQURA_LAST_DAY;
  let limit = bound ?? null;

  if (umalqura) {
    const tighter = limit && (edge === 'min' ? limit.compare(table) > 0 : limit.compare(table) < 0);
    limit = tighter ? limit : table;
  }

  return convertOrNull(limit, display);
}

export function periodAllows(date: CalendarDate, period: HijriDatePeriod, today: CalendarDate) {
  if (period === 'past') {
    return date.compare(today) < 0;
  }

  if (period === 'future') {
    return date.compare(today) > 0;
  }

  return true;
}

/** The date in the calendar that is not displayed, followed by that calendar's label. */
export function equivalentText(
  date: CalendarDate | null,
  display: SupportedCalendar,
  locale: string,
  labels: HijriCalendarLabels,
): string {
  const other = otherCalendar(display);
  const converted = convertOrNull(date, other);
  if (!converted) {
    return '';
  }

  const text = formatCalendarDate(
    converted,
    locale,
    HIJRI_DATE_FORMATS.display.dateA11yLabel as Intl.DateTimeFormatOptions,
  );
  return `${text} ${other === 'gregorian' ? labels.gregorian : labels.hijri}`;
}

function lastDayOfYear(year: number): CalendarDate {
  const lastMonth = createCalendarDate('islamic-umalqura', year, 12, 1);
  return createCalendarDate('islamic-umalqura', year, 12, daysInCalendarMonth(lastMonth));
}
