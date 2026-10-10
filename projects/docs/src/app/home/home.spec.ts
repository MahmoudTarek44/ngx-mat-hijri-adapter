import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getLocalTimeZone } from '@internationalized/date';
import {
  CalendarCode,
  CalendarLocale,
  calendarToday,
  formatCalendarDate,
} from 'ngx-mat-hijri-adapter';

import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the hero, playground, and four live examples', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hijri and Gregorian dates for Angular Material',
    );
    expect(compiled.querySelector('mat-calendar')).not.toBeNull();
    const today = calendarToday(CalendarCode.gregorian, getLocalTimeZone());
    expect(compiled.querySelector('[data-hero-equivalent]')?.textContent).toContain(
      formatCalendarDate(today, CalendarLocale.enUS, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
    expect(compiled.querySelector('#playground playground')).not.toBeNull();
    expect(compiled.querySelectorAll('[data-playground-stage] input').length).toBe(4);
    const examples = compiled.querySelector('#examples');
    const guides = Array.from(examples?.querySelectorAll('[aria-label="Form guides"] a') ?? []).map(
      (link) => link.getAttribute('href'),
    );
    expect(guides).toEqual(['/docs/reactive-fields', '/docs/signal-fields']);
    expect(compiled.querySelectorAll('#examples example-card').length).toBe(4);

    const umalqura = compiled.querySelector('[data-calendar="islamic-umalqura"]');
    const gregorian = compiled.querySelector('[data-calendar="gregorian"]');

    expect(umalqura?.getAttribute('lang')).toBe('ar-SA');
    expect(umalqura?.getAttribute('dir')).toBe('rtl');
    expect(umalqura?.querySelector('input')?.value).toBe('١/٩/١٤٤٥');
    expect(umalqura?.textContent).toContain('يوم الجمعة غير متاح');
    expect(umalqura?.textContent).toContain('Umm al-Qura 1445-09-01 is Gregorian 2024-03-11.');

    expect(gregorian?.getAttribute('lang')).toBe('en-US');
    expect(gregorian?.getAttribute('dir')).toBe('ltr');
    expect(gregorian?.querySelector('input')?.value).toBe('11/3/2024');
    expect(gregorian?.textContent).toContain('Fridays are unavailable.');
    expect(gregorian?.textContent).toContain('Gregorian 2024-03-11 is Umm al-Qura 1445-09-01.');

    for (const name of ['reactive', 'signals']) {
      const fields = compiled.querySelector(`[data-demo="${name}"]`);
      const [appointment, start, end] = Array.from(fields?.querySelectorAll('input') ?? []);

      expect(appointment?.value).toBe('١/٩/١٤٤٥');
      expect(start?.value).toBe('١١/٣/٢٠٢٤');
      expect(end?.value).toBe('٢٠/٣/٢٠٢٤');
      expect(fields?.querySelector('[data-value="appointment"]')?.textContent).toBe(
        'islamic-umalqura 1445-09-01',
      );
      expect(fields?.querySelector('[data-value="stay"]')?.textContent).toBe(
        'gregorian 2024-03-11 → gregorian 2024-03-20',
      );
    }
  });

  it('converts playground values when the calendar changes', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const values = () => compiled.querySelector('[data-playground-values]')?.textContent ?? '';

    expect(values()).toContain('islamic-umalqura');
    const gregorian = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('[data-playground-controls] button'),
    ).find((button) => button.textContent?.trim() === 'Gregorian');
    gregorian?.click();
    await fixture.whenStable();

    expect(values()).not.toContain('islamic-umalqura');
    expect(values()).toContain('gregorian');
  });
});
