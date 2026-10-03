import { describe, expect, it } from 'vitest';

import {
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
} from './calendar-date';

const golden = [
  { gregorian: [2024, 3, 11], hijri: [1445, 9, 1] },
  { gregorian: [2024, 4, 10], hijri: [1445, 10, 1] },
  { gregorian: [2024, 7, 7], hijri: [1446, 1, 1] },
  { gregorian: [2025, 3, 1], hijri: [1446, 9, 1] },
  { gregorian: [2025, 6, 26], hijri: [1447, 1, 1] },
] as const;

describe('Umm al-Qura calendar dates', () => {
  it('matches known Gregorian and Umm al-Qura days', () => {
    for (const entry of golden) {
      const gregorian = createCalendarDate('gregorian', entry.gregorian[0], entry.gregorian[1], entry.gregorian[2]);
      const hijri = convertCalendarDate(gregorian, 'islamic-umalqura');
      const hijriDate = createCalendarDate('islamic-umalqura', entry.hijri[0], entry.hijri[1], entry.hijri[2]);

      expect([hijri.year, hijri.month, hijri.day]).toEqual(entry.hijri);
      expect(compareCalendarDates(gregorian, hijriDate)).toBe(0);
    }
  });

  it('round-trips a Gregorian day through Umm al-Qura', () => {
    const original = createCalendarDate('gregorian', 2026, 10, 1);
    const restored = convertCalendarDate(convertCalendarDate(original, 'islamic-umalqura'), 'gregorian');

    expect(compareCalendarDates(original, restored)).toBe(0);
    expect(restored.year).toBe(2026);
    expect(restored.month).toBe(10);
    expect(restored.day).toBe(1);
  });

  it('knows 29-day and 30-day months and clamps the extra day', () => {
    const ramadan = createCalendarDate('islamic-umalqura', 1445, 9, 1);
    const shawwal = createCalendarDate('islamic-umalqura', 1445, 10, 1);

    expect(daysInCalendarMonth(ramadan)).toBe(30);
    expect(daysInCalendarMonth(shawwal)).toBe(29);

    const nextMonth = addCalendarDate(createCalendarDate('islamic-umalqura', 1445, 9, 30), { months: 1 });
    expect([nextMonth.year, nextMonth.month, nextMonth.day]).toEqual([1445, 10, 29]);
  });

  it('rejects impossible dates and years outside the Umm al-Qura table', () => {
    expect(() => createCalendarDate('islamic-umalqura', UMALQURA_MIN_YEAR - 1, 1, 1)).toThrow(
      UmalquraDateRangeError,
    );
    expect(() => createCalendarDate('islamic-umalqura', UMALQURA_MAX_YEAR + 1, 1, 1)).toThrow(
      UmalquraDateRangeError,
    );
    expect(() => createCalendarDate('islamic-umalqura', 1445, 13, 1)).toThrow(InvalidCalendarDateError);
    expect(() => createCalendarDate('islamic-umalqura', 1445, 10, 30)).toThrow(InvalidCalendarDateError);
    expect(() => convertCalendarDate(createCalendarDate('gregorian', 1800, 1, 1), 'islamic-umalqura')).toThrow(
      UmalquraDateRangeError,
    );
  });

  it('builds today in an explicit time zone', () => {
    const gregorian = calendarToday('gregorian', 'UTC');
    const hijri = calendarToday('islamic-umalqura', 'UTC');

    expect(gregorian.calendar.identifier).toBe('gregory');
    expect(hijri.calendar.identifier).toBe('islamic-umalqura');
    expect(hijri.year).toBeGreaterThanOrEqual(UMALQURA_MIN_YEAR);
    expect(hijri.year).toBeLessThanOrEqual(UMALQURA_MAX_YEAR);
    expect(monthsInCalendarYear(gregorian)).toBe(12);
    expect(monthsInCalendarYear(hijri)).toBe(12);
  });
  it('treats equal calendar numbers in different calendars as different civil days', () => {
    const hijri = createCalendarDate('islamic-umalqura', 1445, 9, 1);
    const sameNumbers = createCalendarDate('gregorian', 1445, 9, 1);

    expect(compareCalendarDates(hijri, sameNumbers)).not.toBe(0);
  });

  it('keeps one-day addition and month length inside AH 1300–1599', () => {
    let date = createCalendarDate('islamic-umalqura', UMALQURA_MIN_YEAR, 1, 1);
    const end = createCalendarDate('islamic-umalqura', UMALQURA_MAX_YEAR, 12, 1);

    while (compareCalendarDates(date, end) < 0) {
      const gregorian = convertCalendarDate(date, 'gregorian');
      const roundTrip = convertCalendarDate(gregorian, 'islamic-umalqura');
      const nextDay = addCalendarDate(date, { days: 1 });

      expect([roundTrip.year, roundTrip.month, roundTrip.day]).toEqual([date.year, date.month, date.day]);
      expect(date.day).toBeLessThanOrEqual(daysInCalendarMonth(date));
      expect(date.calendar.toJulianDay(nextDay) - date.calendar.toJulianDay(date)).toBe(1);

      date = addCalendarDate(date, { days: 17 });
    }
  });
});
