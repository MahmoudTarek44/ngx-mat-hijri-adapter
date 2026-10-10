import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import type { CalendarDate } from '@internationalized/date';
import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

import { ReactiveDateField } from './reactive-date-field';
import type { DateFieldPeriod } from './public-api';

@Component({
  imports: [ReactiveFormsModule, ReactiveDateField],
  template: `
    <ngx-mat-reactive-date-field
      label="Date"
      [formControl]="date"
      [calendarToggle]="toggle()"
      [minDate]="min()"
      [period]="period()"
      [errors]="{
        required: 'Required',
        matDatepickerParse: 'Unreadable',
        matDatepickerMin: 'Too early',
      }"
    />
  `,
})
class Host {
  readonly date = new FormControl<CalendarDate | null>(
    createCalendarDate('islamic-umalqura', 1445, 9, 1),
  );
  readonly toggle = signal(true);
  readonly min = signal<CalendarDate | null>(null);
  readonly period = signal<DateFieldPeriod>('all');
}

async function setup() {
  TestBed.configureTestingModule({
    providers: [provideHijriDateAdapter({ locale: 'en-US', timeZone: 'UTC' })],
  });
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;
  const input = element.querySelector('input') as HTMLInputElement;

  const type = async (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };
  const press = async (name: string) => {
    const button = element.querySelector(`button[aria-label="${name}"]`) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();
  };
  const hint = () => element.querySelector('mat-hint')?.textContent?.trim() ?? '';
  const error = () => element.querySelector('mat-error')?.textContent?.trim() ?? '';

  return { fixture, host: fixture.componentInstance, input, type, press, hint, error };
}

function iso(date: CalendarDate | null | undefined): string {
  if (!date) {
    return String(date);
  }

  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.calendar.identifier}:${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

describe('ReactiveDateField', () => {
  it('shows a Hijri form value and writes typed Hijri dates back', async () => {
    const { host, input, type } = await setup();

    expect(input.value).toBe('1/9/1445');

    await type('10/9/1445');
    expect(iso(host.date.value)).toBe('islamic-umalqura:1445-09-10');
    expect(host.date.dirty).toBe(true);
  });

  it('switches the displayed calendar without changing the form value', async () => {
    const { host, input, type, press, hint } = await setup();

    await press('Gregorian calendar');
    expect(input.value).toBe('11/3/2024');
    expect(hint()).toBe('1 Ramadan, 1445 AH');
    expect(iso(host.date.value)).toBe('islamic-umalqura:1445-09-01');
    expect(host.date.dirty).toBe(false);

    await type('20/3/2024');
    expect(iso(host.date.value)).toBe('islamic-umalqura:1445-09-10');
    expect(hint()).toBe('10 Ramadan, 1445 AH');

    await press('Hijri calendar');
    expect(input.value).toBe('10/9/1445');
    expect(hint()).toBe('20 March, 2024 AD');
  });

  it('reports parse, min, and required errors on the form control', async () => {
    const { fixture, host, type, error } = await setup();
    host.date.addValidators(Validators.required);
    host.min.set(createCalendarDate('gregorian', 2024, 3, 11));
    await fixture.whenStable();

    await type('nope');
    expect(host.date.value).toBeNull();
    expect(host.date.hasError('matDatepickerParse')).toBe(true);
    expect(host.date.hasError('required')).toBe(true);
    expect(error()).toBe('Unreadable');

    await type('29/8/1445');
    expect(host.date.hasError('matDatepickerMin')).toBe(true);
    expect(error()).toBe('Too early');

    await type('');
    expect(host.date.hasError('required')).toBe(true);
    expect(error()).toBe('Required');
  });

  it('filters days by period in any displayed calendar', async () => {
    const { fixture, host, type } = await setup();
    host.period.set('future');
    await fixture.whenStable();

    await type('1/1/1446');
    expect(host.date.hasError('matDatepickerFilter')).toBe(true);
  });

  it('follows the disabled state of the form control', async () => {
    const { fixture, host, input } = await setup();

    host.date.disable();
    await fixture.whenStable();
    expect(input.disabled).toBe(true);

    host.date.enable();
    await fixture.whenStable();
    expect(input.disabled).toBe(false);
  });

  it('shows the plain datepicker toggle when the calendar toggle is off', async () => {
    const { fixture, host } = await setup();
    host.toggle.set(false);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('mat-datepicker-toggle')).not.toBeNull();
    expect(element.querySelector('mat-hint')).toBeNull();
  });

  it('rejects a form value that is not a CalendarDate', async () => {
    const { host } = await setup();
    expect(() => host.date.setValue(new Date() as unknown as CalendarDate)).toThrow(
      /expected a CalendarDate/,
    );
  });

  it('clears a value the Umm al-Qura calendar cannot store', async () => {
    const { fixture, host, input } = await setup();

    host.date.setValue(createCalendarDate('gregorian', 1800, 1, 1));
    await fixture.whenStable();

    expect(host.date.value).toBeNull();
    expect(input.value).toBe('');
  });

  it('keeps two fields on different calendars', async () => {
    @Component({
      imports: [ReactiveFormsModule, ReactiveDateField],
      template: `
        <ngx-mat-reactive-date-field [formControl]="hijri" />
        <ngx-mat-reactive-date-field [formControl]="gregorian" valueCalendar="gregorian" calendarToggle />
      `,
    })
    class TwoFields {
      readonly hijri = new FormControl<CalendarDate | null>(
        createCalendarDate('islamic-umalqura', 1445, 9, 1),
      );
      readonly gregorian = new FormControl<CalendarDate | null>(
        createCalendarDate('gregorian', 2024, 3, 11),
      );
    }

    TestBed.configureTestingModule({
      providers: [provideHijriDateAdapter({ locale: 'en-US', timeZone: 'UTC' })],
    });
    const fixture = TestBed.createComponent(TwoFields);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const [hijri, gregorian] = Array.from(element.querySelectorAll('input'));

    expect(hijri?.value).toBe('1/9/1445');
    expect(gregorian?.value).toBe('11/3/2024');

    (element.querySelector('button[aria-label="Hijri calendar"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(hijri?.value).toBe('1/9/1445');
    expect(gregorian?.value).toBe('1/9/1445');
    expect(fixture.componentInstance.gregorian.value?.calendar.identifier).toBe('gregory');
  });
});
