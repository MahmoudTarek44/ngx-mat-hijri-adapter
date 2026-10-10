import { TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { HIJRI_DATE_FORMATS, UmalquraDateRangeError } from 'ngx-mat-hijri-adapter';

import { NativeHijriDateAdapter } from './native-hijri-date-adapter';
import {
  NATIVE_HIJRI_DATE_ADAPTER_OPTIONS,
  type NativeHijriDateAdapterOptions,
} from './native-hijri-date-adapter-options';
import { provideNativeHijriDateAdapter } from './provide-native-hijri-date-adapter';

function adapter(options: NativeHijriDateAdapterOptions = {}): NativeHijriDateAdapter {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      NativeHijriDateAdapter,
      {
        provide: NATIVE_HIJRI_DATE_ADAPTER_OPTIONS,
        useValue: {
          calendar: 'islamic-umalqura',
          locale: 'en-US',
          timeZone: 'UTC',
          ...options,
        },
      },
    ],
  });

  return TestBed.inject(NativeHijriDateAdapter);
}

describe('NativeHijriDateAdapter', () => {
  it('stores 1 Ramadan 1445 at UTC noon on 11 March 2024', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(ramadan.getUTCFullYear()).toBe(2024);
    expect(ramadan.getUTCMonth()).toBe(2);
    expect(ramadan.getUTCDate()).toBe(11);
    expect(ramadan.getUTCHours()).toBe(12);
    expect(dates.getYear(ramadan)).toBe(1445);
    expect(dates.getMonth(ramadan)).toBe(8);
    expect(dates.getDate(ramadan)).toBe(1);
    expect(dates.getDayOfWeek(ramadan)).toBe(1);
    expect(dates.getNumDaysInMonth(ramadan)).toBe(30);
    expect(dates.toIso8601(ramadan)).toBe('1445-09-01');
  });

  it('starts the Umm al-Qura table on 12 November 1882', () => {
    const start = adapter().createDate(1300, 0, 1);

    expect(start.getUTCFullYear()).toBe(1882);
    expect(start.getUTCMonth()).toBe(10);
    expect(start.getUTCDate()).toBe(12);
    expect(start.getUTCHours()).toBe(12);
  });

  it('parses numeric dates in the adapter calendar, including Arabic-Indic digits', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(dates.sameDate(dates.parse('1445-09-01', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1/9/1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1-9-1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('1.9.1445', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('١/٩/١٤٤٥', null), ramadan)).toBe(true);
    expect(dates.sameDate(dates.parse('۱/۹/۱۴۴۵', null), ramadan)).toBe(true);
    expect(dates.isValid(dates.parse('2024-03-11', null)!)).toBe(false);
    expect(dates.parse('', null)).toBeNull();
    expect(dates.parse('   ', null)).toBeNull();
    expect(dates.parse(null, null)).toBeNull();
    expect(dates.isValid(dates.parse('nope', null)!)).toBe(false);
  });

  it('formats with Intl and parses that text back', () => {
    const english = adapter({ locale: 'en-US' });
    const ramadan = english.createDate(1445, 8, 1);
    const numeric = english.format(ramadan, HIJRI_DATE_FORMATS.display.dateInput);
    const accessible = english.format(ramadan, HIJRI_DATE_FORMATS.display.dateA11yLabel);

    expect(numeric).toBe('1/9/1445');
    expect(accessible).toBe('1 Ramadan, 1445');
    expect(english.sameDate(english.parse(numeric, null), ramadan)).toBe(true);
    expect(english.sameDate(english.parse(accessible, null), ramadan)).toBe(true);
    expect(english.format(ramadan, HIJRI_DATE_FORMATS.display.monthYearLabel)).toBe('Ram. 1445');
    expect(english.getMonthNames('long')[8]).toBe('Ramadan');

    const arabic = adapter({ locale: 'ar-SA' });
    const formatted = arabic.format(ramadan, HIJRI_DATE_FORMATS.display.dateA11yLabel);
    expect(formatted).toContain('رمضان');
    expect(arabic.sameDate(arabic.parse(formatted, null), ramadan)).toBe(true);
  });

  it('keeps the calendar when the locale changes', () => {
    const dates = adapter({ locale: 'en-US' });

    expect(dates.getDayOfWeekNames('long')[0]).toBe('Sunday');
    expect(dates.getFirstDayOfWeek()).toBe(0);

    dates.setLocale('ar-SA');
    expect(dates.getYear(dates.createDate(1445, 8, 1))).toBe(1445);
    expect(dates.getMonthNames('long')[8]).toBe('رمضان');

    dates.setLocale('ar-EG');
    expect(dates.getFirstDayOfWeek()).toBe(6);
    expect(adapter({ firstDayOfWeek: 6 }).getFirstDayOfWeek()).toBe(6);
  });

  it('reads the same instant in the Gregorian calendar after setCalendar', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);
    let notified = 0;
    dates.localeChanges.subscribe(() => notified++);

    dates.setCalendar('gregorian');

    expect(notified).toBe(1);
    expect(dates.calendar).toBe('gregorian');
    expect(dates.getYear(ramadan)).toBe(2024);
    expect(dates.getMonth(ramadan)).toBe(2);
    expect(dates.getDate(ramadan)).toBe(11);
    expect(dates.getNumDaysInMonth(ramadan)).toBe(31);
    expect(dates.toIso8601(ramadan)).toBe('2024-03-11');
    expect(dates.format(ramadan, HIJRI_DATE_FORMATS.display.dateInput)).toBe('11/3/2024');
    expect(dates.getMonthNames('long')[2]).toBe('March');
    expect(dates.sameDate(dates.parse('11/3/2024', null), ramadan)).toBe(true);
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
    expect(dates.isValid(dates.addCalendarYears(dates.createDate(1599, 0, 1), 1))).toBe(false);
    expect(() => dates.createDate(1445, 12, 1)).toThrow(/Month index/);
    expect(() => dates.createDate(1445, 9, 30)).toThrow(/Invalid date/);
  });

  it('deserializes an ISO date in the adapter calendar and a Date instant', () => {
    const dates = adapter();
    const ramadan = dates.createDate(1445, 8, 1);

    expect(dates.sameDate(dates.deserialize('1445-09-01'), ramadan)).toBe(true);
    expect(dates.deserialize('')).toBeNull();
    expect(dates.deserialize(null)).toBeNull();
    expect(dates.isValid(dates.deserialize('1445-9-1')!)).toBe(false);
    expect(dates.isValid(dates.deserialize(1_700_000_000_000)!)).toBe(false);
    expect(
      dates.sameDate(dates.deserialize(new Date(Date.UTC(2024, 2, 11, 0, 30))), ramadan),
    ).toBe(true);
    expect(dates.deserialize(new Date(Date.UTC(2024, 2, 11, 0, 30)))?.getUTCHours()).toBe(12);
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

  it('formats Gregorian dates and clamps a leap day', () => {
    const dates = adapter({ calendar: 'gregorian', locale: 'en-US' });
    const march = dates.createDate(2024, 2, 11);

    expect(march.getUTCHours()).toBe(12);
    expect(dates.getDayOfWeek(march)).toBe(1);
    expect(dates.toIso8601(march)).toBe('2024-03-11');
    expect(dates.format(march, HIJRI_DATE_FORMATS.display.dateA11yLabel)).toBe('11 March, 2024');
    expect(dates.isValid(dates.parse('11 Ramadan, 2024', null)!)).toBe(false);

    const nextYear = dates.addCalendarYears(dates.createDate(2024, 1, 29), 1);
    expect(dates.getYear(nextYear)).toBe(2025);
    expect(dates.getMonth(nextYear)).toBe(1);
    expect(dates.getDate(nextYear)).toBe(28);
  });

  it('registers the Date adapter from provideNativeHijriDateAdapter', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: provideNativeHijriDateAdapter({ locale: 'en-US', timeZone: 'UTC' }),
    });
    const dates = TestBed.inject(DateAdapter) as NativeHijriDateAdapter;

    expect(dates).toBeInstanceOf(NativeHijriDateAdapter);
    expect(dates.calendar).toBe('islamic-umalqura');
    expect(dates.isValid(dates.today())).toBe(true);
    expect(dates.today().getUTCHours()).toBe(12);
  });
});
