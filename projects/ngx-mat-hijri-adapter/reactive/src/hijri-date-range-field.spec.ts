import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

import { type CalendarDateRange, HijriDateRangeField } from './hijri-date-range-field';

@Component({
  imports: [ReactiveFormsModule, HijriDateRangeField],
  template: `
    <hijri-date-range-field
      label="Period"
      valueCalendar="gregorian"
      calendarToggle
      [formControl]="period"
    />
  `,
})
class Host {
  readonly period = new FormControl<CalendarDateRange>({
    start: createCalendarDate('gregorian', 2024, 3, 11),
    end: createCalendarDate('gregorian', 2024, 3, 20),
  });
}

async function setup() {
  TestBed.configureTestingModule({
    providers: [provideHijriDateAdapter({ locale: 'en-US', timeZone: 'UTC' })],
  });
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  const [start, end] = Array.from(element.querySelectorAll('input'));

  const type = async (input: HTMLInputElement, text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };
  const press = async (name: string) => {
    (element.querySelector(`button[aria-label="${name}"]`) as HTMLButtonElement).click();
    await fixture.whenStable();
  };
  const hint = () => element.querySelector('mat-hint')?.textContent?.trim() ?? '';

  return { host: fixture.componentInstance, start: start!, end: end!, type, press, hint };
}

describe('HijriDateRangeField', () => {
  it('keeps a Gregorian value while the Hijri calendar is displayed', async () => {
    const { host, start, end, type, press, hint } = await setup();

    expect(start.value).toBe('11/3/2024');
    expect(end.value).toBe('20/3/2024');

    await press('Hijri calendar');
    expect(start.value).toBe('1/9/1445');
    expect(end.value).toBe('10/9/1445');
    expect(hint()).toBe('11 March, 2024 AD – 20 March, 2024 AD');
    expect(host.period.dirty).toBe(false);

    await type(end, '30/9/1445');
    const value = host.period.value;
    expect(value?.start?.toString()).toBe('2024-03-11');
    expect(value?.end?.calendar.identifier).toBe('gregory');
    expect(value?.end?.toString()).toBe('2024-04-09');
  });

  it('reports an end date before the start date', async () => {
    const { host, end, type } = await setup();

    await type(end, '1/3/2024');
    expect(host.period.hasError('matEndDateInvalid')).toBe(true);
  });
});
