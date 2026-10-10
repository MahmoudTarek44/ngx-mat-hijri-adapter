import { TestBed } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { HIJRI_DATE_FORMATS } from '../formats/date-formats';
import { HijriDateAdapter } from './hijri-date-adapter';
import { provideHijriDateAdapter } from './provide-hijri-date-adapter';

describe('provideHijriDateAdapter', () => {
  it('registers Umm al-Qura and ar-SA independently of each other', () => {
    TestBed.configureTestingModule({
      providers: [provideHijriDateAdapter({ timeZone: 'UTC' })],
    });
    const dates = TestBed.inject(DateAdapter) as HijriDateAdapter;

    expect(dates).toBeInstanceOf(HijriDateAdapter);
    expect(dates.getYear(dates.createDate(1445, 8, 1))).toBe(1445);
    expect(dates.getMonthNames('long')[8]).toBe('رمضان');
    expect(TestBed.inject(MAT_DATE_LOCALE)).toBe('ar-SA');
    expect(TestBed.inject(MAT_DATE_FORMATS)).toBe(HIJRI_DATE_FORMATS);
  });

  it('keeps the Umm al-Qura calendar when the locale is English', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHijriDateAdapter({ calendar: 'islamic-umalqura', locale: 'en-US', timeZone: 'UTC' }),
      ],
    });
    const dates = TestBed.inject(DateAdapter) as HijriDateAdapter;

    expect(dates.getYear(dates.createDate(1445, 8, 1))).toBe(1445);
    expect(dates.getMonthNames('long')[8]).toBe('Ramadan');
    expect(dates.getFirstDayOfWeek()).toBe(0);
    expect(TestBed.inject(MAT_DATE_LOCALE)).toBe('en-US');
  });

  it('keeps ar-SA when the calendar is Gregorian', () => {
    TestBed.configureTestingModule({
      providers: [provideHijriDateAdapter({ calendar: 'gregorian', timeZone: 'UTC' })],
    });
    const dates = TestBed.inject(DateAdapter) as HijriDateAdapter;

    expect(dates.getYear(dates.createDate(2024, 2, 11))).toBe(2024);
    expect(dates.getMonthNames('long')[2]).toBe('مارس');
    expect(TestBed.inject(MAT_DATE_LOCALE)).toBe('ar-SA');
  });

  it('uses an explicit week start', () => {
    TestBed.configureTestingModule({
      providers: [provideHijriDateAdapter({ locale: 'en-US', firstDayOfWeek: 6, timeZone: 'UTC' })],
    });

    expect((TestBed.inject(DateAdapter) as HijriDateAdapter).getFirstDayOfWeek()).toBe(6);
  });

  it('uses custom format slots when they are provided', () => {
    const formats = {
      ...HIJRI_DATE_FORMATS,
      parse: { dateInput: 'custom' },
    };
    TestBed.configureTestingModule({
      providers: [provideHijriDateAdapter({ formats, timeZone: 'UTC' })],
    });

    expect(TestBed.inject(MAT_DATE_FORMATS)).toBe(formats);
  });
});
