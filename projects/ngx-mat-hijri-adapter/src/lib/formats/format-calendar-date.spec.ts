import { createCalendarDate } from '../calendar/calendar-date';
import { HIJRI_DATE_FORMATS } from './date-formats';
import { calendarMonthNames, formatCalendarDate } from './format-calendar-date';

const long = HIJRI_DATE_FORMATS.display.dateA11yLabel as Intl.DateTimeFormatOptions;
const numeric = HIJRI_DATE_FORMATS.display.dateInput as Intl.DateTimeFormatOptions;

describe('formatCalendarDate', () => {
  it('formats each date in its own calendar', () => {
    const ramadan = createCalendarDate('islamic-umalqura', 1445, 9, 1);
    const march = createCalendarDate('gregorian', 2024, 3, 11);

    expect(formatCalendarDate(ramadan, 'en-US', long)).toBe('1 Ramadan, 1445');
    expect(formatCalendarDate(march, 'en-US', long)).toBe('11 March, 2024');
    expect(formatCalendarDate(ramadan, 'en-US', numeric)).toBe('1/9/1445');
  });

  it('uses locale digits and fixed Arabic Umm al-Qura names', () => {
    const ramadan = createCalendarDate('islamic-umalqura', 1445, 9, 1);

    expect(formatCalendarDate(ramadan, 'ar-SA', long)).toBe('١ رمضان، ١٤٤٥');
    expect(formatCalendarDate(ramadan, 'ar-SA', numeric)).toBe('١/٩/١٤٤٥');
  });

  it('names Gregorian months even when the locale defaults to a Hijri calendar', () => {
    const march = createCalendarDate('gregorian', 2024, 3, 11);

    expect(formatCalendarDate(march, 'ar-SA-u-ca-islamic-umalqura', long)).toBe('١١ مارس، ٢٠٢٤');
    expect(calendarMonthNames('gregorian', 'ar-SA-u-ca-islamic-umalqura', 'long')[0]).toBe('يناير');
  });
});
