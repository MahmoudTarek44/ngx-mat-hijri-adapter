import { TestBed } from '@angular/core/testing';
import { UmalquraDateRangeError, createCalendarDate } from '../calendar/calendar-date';
import { HIJRI_DATE_FORMATS } from '../formats/date-formats';
import { HijriDateAdapter } from './hijri-date-adapter';
import {
  HIJRI_DATE_ADAPTER_OPTIONS,
  type HijriDateAdapterOptions,
} from './hijri-date-adapter-options';

function adapter(options: HijriDateAdapterOptions = {}): HijriDateAdapter {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      HijriDateAdapter,
      {
        provide: HIJRI_DATE_ADAPTER_OPTIONS,
        useValue: {
          calendar: 'islamic-umalqura',
          locale: 'en-US',
          timeZone: 'UTC',
          ...options,
        },
      },
    ],
  });

  return TestBed.inject(HijriDateAdapter);
}

describe('HijriDateAdapter', () => {
  it('reads Umm al-Qura dates with Material month indexes', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(dates.getYear(ramadan)).toBe(1445);
    expect(dates.getMonth(ramadan)).toBe(8);
    expect(dates.getDate(ramadan)).toBe(1);
    expect(dates.getDayOfWeek(ramadan)).toBe(1);
    expect(dates.getNumDaysInMonth(ramadan)).toBe(30);
    expect(dates.toIso8601(ramadan)).toBe('1445-09-01');
    expect(dates.sameDate(ramadan, createCalendarDate('gregorian', 2024, 3, 11))).toBe(true);
  });

  it('parses numeric dates in the adapter calendar', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(dates.sameDate(dates.parse('1445-09-01', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1/9/1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1-9-1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1.9.1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('١/٩/١٤٤٥', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('۱/۹/۱۴۴۵', null), ramadan)).toBe(true);

    const shawwal = dates.parse('1447/10/15', null);
    expect(dates.getYear(shawwal!)).toBe(1447);
    expect(dates.getMonth(shawwal!)).toBe(9);
    expect(dates.getDate(shawwal!)).toBe(15);
    expect(dates.sameDate(shawwal, createCalendarDate('gregorian', 1447, 10, 15))).toBe(false);

    const labeledHijri = dates.parse('1446-03-11', null);
    expect(dates.getYear(labeledHijri!)).toBe(1446);
    expect(dates.getMonth(labeledHijri!)).toBe(2);
    expect(dates.getDate(labeledHijri!)).toBe(11);
    expect(dates.sameDate(labeledHijri, createCalendarDate('gregorian', 1446, 3, 11))).toBe(false);
    expect(dates.isValid(dates.parse('2024-03-11', null)!)).toBe(false);
  });

  it('parses fixed month names and rejects empty or unknown text differently', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(dates.sameDate(dates.parse('1 Ramadan, 1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1 رمضان 1445', null), ramadan)).toBe(true);
    expect(
      dates.sameDate(dates.parse('1 Rabi al-Awwal, 1445', null), dates.createDate(1445, 2, 1)),
    ).toBe(true);
    expect(dates.parse('', null)).toBeNull();
    expect(dates.parse('   ', null)).toBeNull();
    expect(dates.parse(null, null)).toBeNull();
    expect(dates.isValid(dates.parse('nope', null)!)).toBe(false);
    expect(dates.isValid(dates.parse('1600-01-01', null)!)).toBe(false);
    expect(dates.isValid(dates.parse(new Date(2024, 2, 11), null)!)).toBe(false);

    const gregorian = createCalendarDate('gregorian', 2024, 3, 11);
    expect(dates.sameDate(dates.parse(gregorian, null), ramadan)).toBe(true);
  });

  it('formats dates that parse back, including locale digits', () => {
    const english = adapter({ locale: 'en-US' });
    const ramadan = english.createDate(1445, 8, 1);
    const numeric = english.format(ramadan, HIJRI_DATE_FORMATS.display.dateInput);
    const accessible = english.format(ramadan, HIJRI_DATE_FORMATS.display.dateA11yLabel);

    expect(numeric).toBe('1/9/1445');
    expect(accessible).toBe('1 Ramadan, 1445');
    expect(english.sameDate(english.parse(numeric, null), ramadan)).toBe(true);
    expect(english.sameDate(english.parse(accessible, null), ramadan)).toBe(true);
    expect(english.format(ramadan, HIJRI_DATE_FORMATS.display.monthYearLabel)).toBe('Ram 1445');

    const arabic = adapter({ locale: 'ar-SA' });
    const formatted = arabic.format(ramadan, HIJRI_DATE_FORMATS.display.dateA11yLabel);
    expect(formatted).toContain('رمضان');
    expect(arabic.sameDate(arabic.parse(formatted, null), ramadan)).toBe(true);
    expect(arabic.format(ramadan, HIJRI_DATE_FORMATS.display.monthYearA11yLabel)).toContain(
      'رمضان',
    );
  });

  it('keeps the calendar when the locale changes', () => {
    const dates = adapter({ locale: 'en-US' });

    expect(dates.getMonthNames('long')[8]).toBe('Ramadan');
    expect(dates.getDayOfWeekNames('long')[0]).toBe('Sunday');
    expect(dates.getFirstDayOfWeek()).toBe(0);

    dates.setLocale('ar-SA');
    expect(dates.getYear(dates.createDate(1445, 8, 1))).toBe(1445);
    expect(dates.getMonthNames('long')[8]).toBe('رمضان');
    expect(dates.getFirstDayOfWeek()).toBe(0);

    dates.setLocale('ar-EG');
    expect(dates.getFirstDayOfWeek()).toBe(6);
    expect(dates.getYear(dates.createDate(1445, 8, 1))).toBe(1445);
  });

  it('clamps short months and rejects dates outside the Umm al-Qura table', () => {
    const dates = adapter();
    const shawwal = dates.addCalendarMonths(dates.createDate(1445, 8, 30), 1);
    const nextDay = dates.addCalendarDays(dates.createDate(1445, 8, 30), 1);

    expect(dates.getYear(shawwal)).toBe(1445);
    expect(dates.getMonth(shawwal)).toBe(9);
    expect(dates.getDate(shawwal)).toBe(29);
    expect(dates.getMonth(nextDay)).toBe(9);
    expect(dates.getDate(nextDay)).toBe(1);
    expect(() => dates.createDate(1600, 0, 1)).toThrow(UmalquraDateRangeError);
    expect(() => dates.createDate(1299, 0, 1)).toThrow(UmalquraDateRangeError);
    expect(() => dates.addCalendarYears(dates.createDate(1599, 0, 1), 1)).toThrow(
      UmalquraDateRangeError,
    );
    expect(() => dates.createDate(1445, 12, 1)).toThrow(/Month index/);
    expect(() => dates.createDate(1445, 9, 30)).toThrow(/Invalid date/);
  });

  it('deserializes only an ISO date in the adapter calendar', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(dates.sameDate(dates.deserialize('1445-09-01'), ramadan)).toBe(true);
    expect(dates.deserialize('')).toBeNull();
    expect(dates.deserialize(null)).toBeNull();
    expect(dates.isValid(dates.deserialize('1445-9-1')!)).toBe(false);
    expect(dates.isValid(dates.deserialize(1_700_000_000_000)!)).toBe(false);
    expect(dates.isValid(dates.deserialize(new Date(Date.UTC(2024, 2, 11)))!)).toBe(false);
  });

  it('treats an invalid sentinel as a date that cannot be formatted', () => {
    const dates = adapter();
    const invalid = dates.invalid();

    expect(dates.isDateInstance(invalid)).toBe(true);
    expect(dates.isValid(invalid)).toBe(false);
    expect(dates.isValid(dates.clone(invalid))).toBe(false);
    expect(dates.isValid(dates.addCalendarDays(invalid, 1))).toBe(false);
    expect(() => dates.format(invalid, HIJRI_DATE_FORMATS.display.dateInput)).toThrow(
      /invalid date/i,
    );
    expect(() => dates.toIso8601(invalid)).toThrow(/invalid date/i);
  });

  it('defaults to Umm al-Qura and ar-SA', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [HijriDateAdapter] });
    const dates = TestBed.inject(HijriDateAdapter);

    expect(dates.getMonthNames('long')[8]).toBe('رمضان');
    expect(dates.getYear(dates.createDate(1445, 8, 1))).toBe(1445);
    expect(dates.isValid(dates.today())).toBe(true);
  });

  it('formats and parses Gregorian dates without taking over Hijri names', () => {
    const dates = adapter({ calendar: 'gregorian', locale: 'en-US' });
    const march = dates.createDate(2024, 2, 11);
    const accessible = dates.format(march, HIJRI_DATE_FORMATS.display.dateA11yLabel);

    expect(dates.getDayOfWeek(march)).toBe(1);
    expect(dates.toIso8601(march)).toBe('2024-03-11');
    expect(dates.getMonthNames('long')[2]).toBe('March');
    expect(accessible).toBe('11 March, 2024');
    expect(dates.sameDate(dates.parse(accessible, null), march)).toBe(true);
    expect(dates.sameDate(dates.parse('11/3/2024', null), march)).toBe(true);
    expect(dates.isValid(dates.parse('11 Ramadan, 2024', null)!)).toBe(false);

    const nextYear = dates.addCalendarYears(dates.createDate(2024, 1, 29), 1);
    expect(dates.getYear(nextYear)).toBe(2025);
    expect(dates.getMonth(nextYear)).toBe(1);
    expect(dates.getDate(nextYear)).toBe(28);
  });
});
