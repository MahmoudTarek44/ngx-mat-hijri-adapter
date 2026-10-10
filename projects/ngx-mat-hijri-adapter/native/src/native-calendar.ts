import { UMALQURA_MAX_YEAR, UMALQURA_MIN_YEAR } from 'ngx-mat-hijri-adapter';

import { UMALQURA_MONTH_LENGTHS } from './umalqura-months';

/** 1 Muharram 1300, stored at UTC noon so a time zone cannot move the civil day. */
const EPOCH_UTC = Date.UTC(1882, 10, 12, 12, 0, 0);
const DAY_MS = 86_400_000;

export interface CivilDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

/** Days in a Umm al-Qura month, or `null` outside AH 1300–1599. Month is 1-based. */
export function umalquraMonthLength(year: number, month: number): number | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  if (year < UMALQURA_MIN_YEAR || year > UMALQURA_MAX_YEAR) {
    return null;
  }

  const index = (year - UMALQURA_MIN_YEAR) * 12 + (month - 1);
  return UMALQURA_MONTH_LENGTHS.charCodeAt(index) === 49 ? 30 : 29;
}

/** Days in a Gregorian month. Month is 1-based. */
export function gregorianMonthLength(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function umalquraToUtcNoon(year: number, month: number, day: number): Date | null {
  const length = umalquraMonthLength(year, month);
  if (length == null || !Number.isInteger(day) || day < 1 || day > length) {
    return null;
  }

  let days = day - 1;
  for (let current = UMALQURA_MIN_YEAR; current < year; current++) {
    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
      days += umalquraMonthLength(current, monthIndex) ?? 0;
    }
  }

  for (let monthIndex = 1; monthIndex < month; monthIndex++) {
    days += umalquraMonthLength(year, monthIndex) ?? 0;
  }

  return new Date(EPOCH_UTC + days * DAY_MS);
}

export function utcToUmalqura(date: Date): CivilDate | null {
  const days = Math.round((utcNoon(date).getTime() - EPOCH_UTC) / DAY_MS);
  if (days < 0) {
    return null;
  }

  let remaining = days;
  for (let year = UMALQURA_MIN_YEAR; year <= UMALQURA_MAX_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      const length = umalquraMonthLength(year, month) ?? 0;
      if (remaining < length) {
        return { year, month, day: remaining + 1 };
      }

      remaining -= length;
    }
  }

  return null;
}

export function gregorianToUtcNoon(year: number, month: number, day: number): Date | null {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > gregorianMonthLength(year, month)
  ) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function utcToGregorian(date: Date): CivilDate {
  const noon = utcNoon(date);
  return { year: noon.getUTCFullYear(), month: noon.getUTCMonth() + 1, day: noon.getUTCDate() };
}

export function addCivilMonths(
  date: CivilDate,
  months: number,
  lengthOf: (year: number, month: number) => number | null,
): CivilDate | null {
  if (!Number.isInteger(months)) {
    return null;
  }

  const index = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(index / 12);
  const month = index - year * 12 + 1;
  const length = lengthOf(year, month);
  if (length == null) {
    return null;
  }

  return { year, month, day: Math.min(date.day, length) };
}

export function addUtcDays(date: Date, days: number): Date | null {
  if (!Number.isInteger(days)) {
    return null;
  }

  return new Date(utcNoon(date).getTime() + days * DAY_MS);
}

function utcNoon(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
}
