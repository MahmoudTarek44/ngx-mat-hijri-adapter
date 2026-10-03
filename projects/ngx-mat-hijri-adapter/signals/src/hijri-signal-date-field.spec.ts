import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, disabled, form, required } from '@angular/forms/signals';
import type { CalendarDate } from '@internationalized/date';
import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

import { HijriSignalDateField } from './hijri-signal-date-field';

interface Model {
  date: CalendarDate | null;
}

@Component({
  imports: [FormField, HijriSignalDateField],
  template: `
    <hijri-signal-date-field
      label="Date"
      calendarToggle
      [formField]="f.date"
      [minDate]="min"
      [errorMessages]="{ matDatepickerMin: 'Too early' }"
    />
  `,
})
class Host {
  readonly model = signal<Model>({ date: createCalendarDate('islamic-umalqura', 1445, 9, 1) });
  readonly f = form(this.model, (path) => required(path.date, { message: 'Required' }));
  readonly min = createCalendarDate('gregorian', 2024, 3, 11);
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
    (element.querySelector(`button[aria-label="${name}"]`) as HTMLButtonElement).click();
    await fixture.whenStable();
  };
  const text = (selector: string) => element.querySelector(selector)?.textContent?.trim() ?? '';

  return { fixture, host: fixture.componentInstance, input, type, press, text };
}

function ymd(date: CalendarDate | null): string {
  return date ? `${date.calendar.identifier}:${date.year}-${date.month}-${date.day}` : 'null';
}

describe('HijriSignalDateField', () => {
  it('shows the field value and writes typed dates back to the model', async () => {
    const { host, input, type } = await setup();

    expect(input.value).toBe('1/9/1445');

    await type('10/9/1445');
    expect(ymd(host.model().date)).toBe('islamic-umalqura:1445-9-10');
    expect(host.f.date().dirty()).toBe(true);
    expect(host.f.date().touched()).toBe(true);
  });

  it('switches the displayed calendar without changing the model', async () => {
    const { host, input, type, press, text } = await setup();

    await press('Gregorian calendar');
    expect(input.value).toBe('11/3/2024');
    expect(text('mat-hint')).toBe('1 Ramadan, 1445 AH');
    expect(ymd(host.model().date)).toBe('islamic-umalqura:1445-9-1');
    expect(host.f.date().dirty()).toBe(false);

    await type('20/3/2024');
    expect(ymd(host.model().date)).toBe('islamic-umalqura:1445-9-10');
  });

  it('follows model changes made outside the field', async () => {
    const { fixture, host, input } = await setup();

    host.model.set({ date: createCalendarDate('gregorian', 2024, 4, 9) });
    await fixture.whenStable();
    expect(input.value).toBe('30/9/1445');
  });

  it('reports datepicker errors to the field and shows the first message', async () => {
    const { host, type, text } = await setup();

    await type('nope');
    expect(host.model().date).toBeNull();
    const kinds = host.f
      .date()
      .errors()
      .map((error) => error.kind);
    expect(kinds).toContain('matDatepickerParse');
    expect(kinds).toContain('required');
    expect(text('mat-error')).toBe('Required');

    await type('29/8/1445');
    expect(
      host.f
        .date()
        .errors()
        .map((error) => error.kind),
    ).toEqual(['matDatepickerMin']);
    expect(text('mat-error')).toBe('Too early');

    await type('5/9/1445');
    expect(host.f.date().errors()).toEqual([]);
    expect(text('mat-error')).toBe('');
  });

  it('follows the disabled state of the field', async () => {
    TestBed.configureTestingModule({ providers: [provideHijriDateAdapter({ locale: 'en-US' })] });

    @Component({
      imports: [FormField, HijriSignalDateField],
      template: `<hijri-signal-date-field [formField]="f.date" />`,
    })
    class DisabledHost {
      readonly model = signal<Model>({ date: null });
      readonly f = form(this.model, (path) => disabled(path.date));
    }

    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
