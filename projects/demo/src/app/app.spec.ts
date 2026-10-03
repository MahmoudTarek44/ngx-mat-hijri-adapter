import { TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('shows the unpublished package version', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('ngx-mat-hijri-adapter');
    expect(compiled.textContent).toContain('Workspace version 0.0.0.');
    expect(compiled.textContent).toContain('Umm al-Qura 1445-09-01 is Gregorian 2024-03-11.');

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

    const reactive = compiled.querySelector('[data-demo="reactive"]');
    const [appointment, start, end] = Array.from(reactive?.querySelectorAll('input') ?? []);

    expect(appointment?.value).toBe('١/٩/١٤٤٥');
    expect(start?.value).toBe('١١/٣/٢٠٢٤');
    expect(end?.value).toBe('٢٠/٣/٢٠٢٤');
    expect(reactive?.querySelector('[data-value="appointment"]')?.textContent).toBe(
      'islamic-umalqura 1445-09-01',
    );
    expect(reactive?.querySelector('[data-value="stay"]')?.textContent).toBe(
      'gregorian 2024-03-11 → gregorian 2024-03-20',
    );
  });
});
