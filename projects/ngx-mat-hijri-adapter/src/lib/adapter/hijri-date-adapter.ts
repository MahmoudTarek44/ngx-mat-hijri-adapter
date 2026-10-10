import { Injectable, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { CalendarDate, type DateDuration } from '@internationalized/date';

import {
  UmalquraDateRangeError,
  addCalendarDate,
  calendarToday,
  compareCalendarDates,
  convertCalendarDate,
  createCalendarDate,
  daysInCalendarMonth,
} from '../calendar/calendar-date';
import { CalendarCode, type SupportedCalendar } from '../calendar/supported-calendars';
import {
  calendarMonthNames,
  formatCalendarDate,
  formatNumber,
} from '../formats/format-calendar-date';
import { CalendarLocale } from '../locale/calendar-locale';
import { normalizeMonthLabel, umalquraMonthNumber } from '../locale/month-names';
import { HIJRI_DATE_ADAPTER_OPTIONS } from './hijri-date-adapter-options';

const invalidDates = new WeakSet<CalendarDate>();

const NUMERIC_DATE = /^(\d{1,4})([./-])(\d{1,2})\2(\d{1,4})$/;
const NAMED_DATE = /^(\d{1,2})[\s,،]+(.+?)[\s,،]+(\d{1,4})$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Material date adapter for `CalendarDate`.
 * Numeric dates belong to the configured calendar. Changing the locale does not change it.
 */
@Injectable()
export class HijriDateAdapter extends DateAdapter<CalendarDate, string> {
  private calendarId: SupportedCalendar;
  private readonly timeZone: string;
  private readonly weekStartsOn: number | null;

  constructor() {
    super();
    const options = inject(HIJRI_DATE_ADAPTER_OPTIONS, { optional: true }) ?? {};
    this.calendarId = options.calendar ?? CalendarCode.umalqura;
    this.timeZone = options.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.weekStartsOn = weekStart(options.firstDayOfWeek);
    this.setLocale(options.locale ?? CalendarLocale.arSA);
  }

  /** The calendar that owns parsing, display, and the dates this adapter creates. */
  get calendar(): SupportedCalendar {
    return this.calendarId;
  }

  /**
   * Switches the calendar at runtime and notifies Material through `localeChanges`.
   * Dates passed to the adapter afterwards are converted to the new calendar.
   */
  setCalendar(calendar: SupportedCalendar): void {
    if (calendar === this.calendarId) {
      return;
    }

    this.calendarId = calendar;
    this._localeChanges.next();
  }

  override getYear(date: CalendarDate): number {
    return this.isValid(date) ? this.inCalendar(date).year : Number.NaN;
  }

  override getMonth(date: CalendarDate): number {
    return this.isValid(date) ? this.inCalendar(date).month - 1 : Number.NaN;
  }

  override getDate(date: CalendarDate): number {
    return this.isValid(date) ? this.inCalendar(date).day : Number.NaN;
  }

  override getDayOfWeek(date: CalendarDate): number {
    if (!this.isValid(date)) {
      return Number.NaN;
    }

    return convertCalendarDate(date, CalendarCode.gregorian).toDate('UTC').getUTCDay();
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return calendarMonthNames(this.calendarId, this.locale, style);
  }

  override getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, index) => formatNumber(index + 1, this.locale));
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'UTC' });
    const sunday = Date.UTC(2023, 0, 1);
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(new Date(sunday + index * 86_400_000)),
    );
  }

  override getYearName(date: CalendarDate): string {
    return formatNumber(this.getYear(date), this.locale);
  }

  override getFirstDayOfWeek(): number {
    return this.weekStartsOn ?? firstDayOfWeek(this.locale);
  }

  override getNumDaysInMonth(date: CalendarDate): number {
    return this.isValid(date) ? daysInCalendarMonth(this.inCalendar(date)) : Number.NaN;
  }

  override clone(date: CalendarDate): CalendarDate {
    if (!this.isValid(date)) {
      return this.invalid();
    }

    const converted = this.inCalendar(date);
    return createCalendarDate(this.calendarId, converted.year, converted.month, converted.day);
  }

  override createDate(year: number, month: number, date: number): CalendarDate {
    if (month < 0 || month > 11) {
      throw new Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw new Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    try {
      return createCalendarDate(this.calendarId, year, month + 1, date);
    } catch (error) {
      if (error instanceof UmalquraDateRangeError) {
        throw error;
      }

      throw new Error(`Invalid date "${date}" for month with index "${month}".`);
    }
  }

  override today(): CalendarDate {
    return calendarToday(this.calendarId, this.timeZone);
  }

  override parse(value: unknown, _parseFormat: unknown): CalendarDate | null {
    if (value == null) {
      return null;
    }

    if (value instanceof CalendarDate) {
      return this.adopt(value);
    }

    if (typeof value !== 'string') {
      return this.invalid();
    }

    const text = normalizeDigits(value).trim();
    if (text === '') {
      return null;
    }

    return this.parseText(text);
  }

  override format(date: CalendarDate, displayFormat: unknown): string {
    if (!this.isValid(date)) {
      throw new Error('HijriDateAdapter: Cannot format invalid date.');
    }

    return formatCalendarDate(this.inCalendar(date), this.locale, readFormatOptions(displayFormat));
  }

  override addCalendarYears(date: CalendarDate, years: number): CalendarDate {
    return this.shift(date, { years });
  }

  override addCalendarMonths(date: CalendarDate, months: number): CalendarDate {
    return this.shift(date, { months });
  }

  override addCalendarDays(date: CalendarDate, days: number): CalendarDate {
    return this.shift(date, { days });
  }

  /** `YYYY-MM-DD` in this adapter's calendar, with ASCII digits. This is not a Gregorian conversion. */
  override toIso8601(date: CalendarDate): string {
    if (!this.isValid(date)) {
      throw new Error('HijriDateAdapter: Cannot convert invalid date to ISO 8601.');
    }

    const converted = this.inCalendar(date);
    const year = String(converted.year).padStart(4, '0');
    const month = String(converted.month).padStart(2, '0');
    const day = String(converted.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  override isDateInstance(obj: unknown): boolean {
    return obj instanceof CalendarDate;
  }

  override isValid(date: CalendarDate): boolean {
    return date instanceof CalendarDate && !invalidDates.has(date);
  }

  override invalid(): CalendarDate {
    const date = createCalendarDate(CalendarCode.gregorian, 1970, 1, 1);
    invalidDates.add(date);
    return date;
  }

  override deserialize(value: unknown): CalendarDate | null {
    if (value == null || value === '') {
      return null;
    }

    if (value instanceof CalendarDate) {
      return this.adopt(value);
    }

    if (typeof value !== 'string' || !ISO_DATE.test(normalizeDigits(value).trim())) {
      return this.invalid();
    }

    return this.parseText(normalizeDigits(value).trim());
  }

  override compareDate(first: CalendarDate, second: CalendarDate): number {
    if (!this.isValid(first) || !this.isValid(second)) {
      return Number.NaN;
    }

    return compareCalendarDates(first, second);
  }

  /** The same day in this adapter's calendar. */
  private inCalendar(date: CalendarDate): CalendarDate {
    return convertCalendarDate(date, this.calendarId);
  }

  private adopt(date: CalendarDate): CalendarDate {
    if (!this.isValid(date)) {
      return this.invalid();
    }

    try {
      return this.clone(date);
    } catch {
      return this.invalid();
    }
  }

  private parseText(text: string): CalendarDate {
    try {
      const parsed = this.parseNamed(text) ?? this.parseNumeric(text);
      return parsed ?? this.invalid();
    } catch {
      return this.invalid();
    }
  }

  private parseNumeric(text: string): CalendarDate | null {
    const match = NUMERIC_DATE.exec(text);
    if (!match) {
      return null;
    }

    const first = Number(match[1]);
    const month = Number(match[3]);
    const last = Number(match[4]);
    const yearFirst = (match[2] === '-' && match[1].length >= 4) || first > 31;
    const year = yearFirst ? first : last;
    const day = yearFirst ? last : first;
    return createCalendarDate(this.calendarId, year, month, day);
  }

  private parseNamed(text: string): CalendarDate | null {
    const match = NAMED_DATE.exec(text);
    if (!match) {
      return null;
    }

    const month = this.monthNumber(match[2] ?? '');
    if (month == null) {
      return null;
    }

    return createCalendarDate(this.calendarId, Number(match[3]), month, Number(match[1]));
  }

  private monthNumber(label: string): number | null {
    if (this.calendarId === CalendarCode.umalqura) {
      return umalquraMonthNumber(label);
    }

    const normalized = normalizeMonthLabel(label);
    for (const style of ['long', 'short'] as const) {
      const index = this.getMonthNames(style).findIndex(
        (name) => normalizeMonthLabel(name) === normalized,
      );
      if (index >= 0) {
        return index + 1;
      }
    }

    return null;
  }

  private shift(date: CalendarDate, duration: DateDuration): CalendarDate {
    if (!this.isValid(date)) {
      return this.invalid();
    }

    try {
      return addCalendarDate(this.inCalendar(date), duration);
    } catch (error) {
      if (error instanceof UmalquraDateRangeError) {
        return this.invalid();
      }

      throw error;
    }
  }
}

function weekStart(day: number | undefined): number | null {
  if (day === undefined || !Number.isInteger(day) || day < 0 || day > 6) {
    return null;
  }

  return day;
}

function readFormatOptions(displayFormat: unknown): Intl.DateTimeFormatOptions {
  if (typeof displayFormat !== 'object' || displayFormat === null) {
    return {};
  }

  return displayFormat as Intl.DateTimeFormatOptions;
}

function firstDayOfWeek(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay?: number };
      weekInfo?: { firstDay?: number };
    };
    const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 0;
    return firstDay === 7 ? 0 : firstDay;
  } catch {
    return 0;
  }
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}
