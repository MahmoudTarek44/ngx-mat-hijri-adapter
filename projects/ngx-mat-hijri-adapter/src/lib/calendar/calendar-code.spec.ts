import { CalendarLocale } from '../locale/calendar-locale';
import { createCalendarDate } from './calendar-date';
import { CalendarCode, supportedCalendar } from './supported-calendars';

describe('CalendarCode and CalendarLocale', () => {
  it('names the supported calendars', () => {
    expect(Object.values(CalendarCode)).toEqual(['gregorian', 'islamic-umalqura']);
    expect(supportedCalendar(CalendarCode.gregorian).identifier).toBe('gregory');
    expect(supportedCalendar(CalendarCode.umalqura).identifier).toBe('islamic-umalqura');
    expect(createCalendarDate(CalendarCode.umalqura, 1445, 9, 1).year).toBe(1445);
  });

  it('names the default locales', () => {
    expect(CalendarLocale).toEqual({ arSA: 'ar-SA', enUS: 'en-US' });
  });
});
