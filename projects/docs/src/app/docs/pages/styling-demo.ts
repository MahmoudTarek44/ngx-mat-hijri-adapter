import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import type { CalendarDate } from '@internationalized/date';

import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';
import { SignalDateField } from 'ngx-mat-hijri-adapter/signals';

@Component({
  selector: 'styling-demo',
  imports: [FormField, SignalDateField],
  providers: [provideHijriDateAdapter({ calendar: 'gregorian', locale: 'en-US', timeZone: 'UTC' })],
  template: `
    <form class="booking grid px-6 pt-5 pb-6">
      <ngx-mat-signal-date-field class="w-full" label="Date" [formField]="dateForm.date" />
    </form>
  `,
})
export class StylingDemo {
  private readonly model = signal<{ date: CalendarDate | null }>({
    date: createCalendarDate('gregorian', 2024, 3, 11),
  });
  protected readonly dateForm = form(this.model);
}
