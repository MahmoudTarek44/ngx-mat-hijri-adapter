import { Injectable, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  CalendarCode,
  CalendarLocale,
  UMALQURA_MAX_YEAR,
  UMALQURA_MIN_YEAR,
  UmalquraDateRangeError,
  type SupportedCalendar,
} from 'ngx-mat-hijri-adapter';

import {
  addCivilMonths,
  addUtcDays,
  gregorianMonthLength,
  gregorianToUtcNoon,
  umalquraMonthLength,
  umalquraToUtcNoon,
  utcToGregorian,
  utcToUmalqura,
  type CivilDate,
} from './native-calendar';
import { NATIVE_HIJRI_DATE_ADAPTER_OPTIONS } from './native-hijri-date-adapter-options';

const NUMERIC_DATE = /^(\d{1,4})([./-])(\d{1,2})\2(\d{1,4})$/;
const NAMED_DATE = /^(\d{1,2})[\s,،]+(.+?)[\s,،]+(\d{1,4})$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Material date adapter for a JavaScript `Date`.
 * Formatting and parsing use `Intl`. Day arithmetic uses an in-repo Umm al-Qura table.
 * Each stored instant is UTC noon of that civil day. Changing the locale does not change the calendar.
 */
@Injectable()
export class NativeHijriDateAdapter extends DateAdapter<Date, string> {
  private calendarId: SupportedCalendar;
  private readonly timeZone: string;
  private readonly weekStartsOn: number | null;

  constructor() {
    super();
    const options = inject(NATIVE_HIJRI_DATE_ADAPTER_OPTIONS, { optional: true }) ?? {};
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
   * A stored `Date` is the same instant afterwards; later reads use the new calendar.
   */
  setCalendar(calendar: SupportedCalendar): void {
    if (calendar === this.calendarId) {
      return;
    }

    this.calendarId = calendar;
    this._localeChanges.next();
  }

  override getYear(date: Date): number {
    return this.civil(date)?.year ?? Number.NaN;
  }

  override getMonth(date: Date): number {
    const month = this.civil(date)?.month;
    return month == null ? Number.NaN : month - 1;
  }

  override getDate(date: Date): number {
    return this.civil(date)?.day ?? Number.NaN;
  }

  override getDayOfWeek(date: Date): number {
    return this.isValid(date) ? date.getUTCDay() : Number.NaN;
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      calendar: this.intlCalendar,
      month: style,
      timeZone: 'UTC',
    });

    return Array.from({ length: 12 }, (_, month) => {
      const sample = this.sampleDate(month + 1);
      return formatter.formatToParts(sample).find((part) => part.type === 'month')?.value ?? '';
    });
  }

  override getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, index) => this.formatNumber(index + 1));
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'UTC' });
    const sunday = Date.UTC(2023, 0, 1);
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(new Date(sunday + index * 86_400_000)),
    );
  }

  override getYearName(date: Date): string {
    return this.formatNumber(this.getYear(date));
  }

  override getFirstDayOfWeek(): number {
    return this.weekStartsOn ?? firstDayOfWeek(this.locale);
  }

  override getNumDaysInMonth(date: Date): number {
    const civil = this.civil(date);
    if (!civil) {
      return Number.NaN;
    }

    return this.monthLength(civil.year, civil.month) ?? Number.NaN;
  }

  override clone(date: Date): Date {
    return this.fromCivil(this.civil(date)) ?? this.invalid();
  }

  override createDate(year: number, month: number, date: number): Date {
    if (!Number.isInteger(month) || month < 0 || month > 11) {
      throw new Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (!Number.isInteger(date) || date < 1) {
      throw new Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    if (
      this.calendarId === CalendarCode.umalqura &&
      (!Number.isInteger(year) || year < UMALQURA_MIN_YEAR || year > UMALQURA_MAX_YEAR)
    ) {
      throw new UmalquraDateRangeError(year);
    }

    const instant = this.fromParts(year, month + 1, date);
    if (!instant) {
      throw new Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return instant;
  }

  override today(): Date {
    const parts = new Intl.DateTimeFormat('en-US', {
      calendar: this.intlCalendar,
      day: 'numeric',
      month: 'numeric',
      numberingSystem: 'latn',
      timeZone: this.timeZone,
      year: 'numeric',
    }).formatToParts(new Date());
    const year = Number(parts.find((part) => part.type === 'year')?.value);
    const month = Number(parts.find((part) => part.type === 'month')?.value);
    const day = Number(parts.find((part) => part.type === 'day')?.value);
    return this.createDate(year, month - 1, day);
  }

  override parse(value: unknown, _parseFormat: unknown): Date | null {
    if (value == null) {
      return null;
    }

    if (value instanceof Date) {
      return this.clone(value);
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

  override format(date: Date, displayFormat: unknown): string {
    if (!this.isValid(date)) {
      throw new Error('NativeHijriDateAdapter: Cannot format invalid date.');
    }

    const options = readFormatOptions(displayFormat);
    const formatted = new Intl.DateTimeFormat(this.locale, {
      ...options,
      calendar: this.intlCalendar,
      timeZone: 'UTC',
    }).formatToParts(date);
    const day = options.day ? partValue(formatted, 'day') : '';
    const month = options.month ? partValue(formatted, 'month') : '';
    const year = options.year ? partValue(formatted, 'year') : '';
    const numericMonth = options.month === 'numeric' || options.month === '2-digit';

    if (day && month && year) {
      const comma = this.locale.toLowerCase().startsWith('ar') ? '،' : ',';
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

  override addCalendarYears(date: Date, years: number): Date {
    return this.shiftMonths(date, years * 12);
  }

  override addCalendarMonths(date: Date, months: number): Date {
    return this.shiftMonths(date, months);
  }

  override addCalendarDays(date: Date, days: number): Date {
    if (!this.isValid(date)) {
      return this.invalid();
    }

    const next = addUtcDays(date, days);
    return next && this.civil(next) ? next : this.invalid();
  }

  /** `YYYY-MM-DD` in this adapter's calendar, with ASCII digits. This is not a Gregorian conversion. */
  override toIso8601(date: Date): string {
    const civil = this.civil(date);
    if (!civil) {
      throw new Error('NativeHijriDateAdapter: Cannot convert invalid date to ISO 8601.');
    }

    const year = String(civil.year).padStart(4, '0');
    const month = String(civil.month).padStart(2, '0');
    const day = String(civil.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  override isDateInstance(obj: unknown): boolean {
    return obj instanceof Date;
  }

  override isValid(date: Date): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime()) && this.civil(date) !== null;
  }

  override invalid(): Date {
    return new Date(Number.NaN);
  }

  override deserialize(value: unknown): Date | null {
    if (value == null || value === '') {
      return null;
    }

    if (value instanceof Date) {
      return this.clone(value);
    }

    if (typeof value !== 'string' || !ISO_DATE.test(normalizeDigits(value).trim())) {
      return this.invalid();
    }

    return this.parseText(normalizeDigits(value).trim());
  }

  override compareDate(first: Date, second: Date): number {
    const left = this.civil(first);
    const right = this.civil(second);
    if (!left || !right) {
      return Number.NaN;
    }

    return left.year - right.year || left.month - right.month || left.day - right.day;
  }

  private get intlCalendar(): 'gregory' | 'islamic-umalqura' {
    return this.calendarId === CalendarCode.gregorian ? 'gregory' : 'islamic-umalqura';
  }

  private civil(date: Date): CivilDate | null {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return null;
    }

    return this.calendarId === CalendarCode.gregorian ? utcToGregorian(date) : utcToUmalqura(date);
  }

  private fromCivil(date: CivilDate | null): Date | null {
    return date ? this.fromParts(date.year, date.month, date.day) : null;
  }

  private fromParts(year: number, month: number, day: number): Date | null {
    return this.calendarId === CalendarCode.gregorian
      ? gregorianToUtcNoon(year, month, day)
      : umalquraToUtcNoon(year, month, day);
  }

  private monthLength(year: number, month: number): number | null {
    return this.calendarId === CalendarCode.gregorian
      ? gregorianMonthLength(year, month)
      : umalquraMonthLength(year, month);
  }

  private sampleDate(month: number): Date {
    return this.calendarId === CalendarCode.gregorian
      ? gregorianToUtcNoon(2024, month, 1)!
      : umalquraToUtcNoon(1445, month, 1)!;
  }

  private shiftMonths(date: Date, months: number): Date {
    const civil = this.civil(date);
    if (!civil) {
      return this.invalid();
    }

    const next = addCivilMonths(civil, months, (year, month) => this.monthLength(year, month));
    return this.fromCivil(next) ?? this.invalid();
  }

  private parseText(text: string): Date {
    try {
      return this.parseNamed(text) ?? this.parseNumeric(text) ?? this.invalid();
    } catch {
      return this.invalid();
    }
  }

  private parseNumeric(text: string): Date | null {
    const match = NUMERIC_DATE.exec(text);
    if (!match) {
      return null;
    }

    const first = Number(match[1]);
    const month = Number(match[3]);
    const last = Number(match[4]);
    const yearFirst = (match[2] === '-' && (match[1]?.length ?? 0) >= 4) || first > 31;
    const year = yearFirst ? first : last;
    const day = yearFirst ? last : first;
    return this.createDate(year, month - 1, day);
  }

  private parseNamed(text: string): Date | null {
    const match = NAMED_DATE.exec(text);
    if (!match) {
      return null;
    }

    const month = this.monthNumber(match[2] ?? '');
    if (month == null) {
      return null;
    }

    return this.createDate(Number(match[3]), month - 1, Number(match[1]));
  }

  private monthNumber(label: string): number | null {
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

  private formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale, { useGrouping: false }).format(value);
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

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? '';
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

function normalizeMonthLabel(value: string): string {
  return value.trim().replace(/\./g, '').replace(/\s+/g, ' ').toLowerCase();
}
