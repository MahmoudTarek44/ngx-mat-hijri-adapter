import { Dir } from '@angular/cdk/bidi';
import { Component, InjectionToken, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import type { CalendarDate } from '@internationalized/date';

import {
  CalendarCode,
  CalendarLocale,
  convertCalendarDate,
  provideHijriDateAdapter,
  type SupportedCalendar,
} from 'ngx-mat-hijri-adapter';

import { DemoControls, type DemoDirection, type DemoLocale } from '../../shared/demo-controls';

const DEMO_CALENDAR = new InjectionToken<SupportedCalendar>('DEMO_CALENDAR');

@Component({
  selector: 'calendar-demo',
  imports: [
    Dir,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    MatSuffix,
    MatInput,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    DemoControls,
  ],
  templateUrl: './calendar-demo.html',
})
export class CalendarDemo {
  private readonly adapter = inject<DateAdapter<CalendarDate, string>>(DateAdapter);
  protected readonly calendar = inject(DEMO_CALENDAR);
  protected readonly locale = signal<DemoLocale>(this.calendar === 'gregorian' ? 'en-US' : 'ar-SA');
  protected readonly direction = signal<DemoDirection>(
    this.calendar === 'gregorian' ? 'ltr' : 'rtl',
  );
  protected readonly min: CalendarDate;
  protected readonly max: CalendarDate;
  protected readonly date: FormControl<CalendarDate | null>;

  constructor() {
    if (this.calendar === 'islamic-umalqura') {
      this.min = this.adapter.createDate(1445, 8, 1);
      this.max = this.adapter.createDate(1445, 8, 30);
    } else {
      this.min = this.adapter.createDate(2024, 2, 11);
      this.max = this.adapter.createDate(2024, 2, 31);
    }

    this.date = new FormControl(this.min);
    effect(() => this.adapter.setLocale(this.locale()));
  }

  protected readonly disableFridays = (date: CalendarDate | null): boolean =>
    date != null && this.adapter.isValid(date) && this.adapter.getDayOfWeek(date) !== 5;

  protected calendarTitle(): string {
    return this.calendar === 'islamic-umalqura' ? 'Umm al-Qura' : 'Gregorian';
  }

  protected fieldLabel(): string {
    return this.locale() === 'ar-SA' ? 'التاريخ' : 'Date';
  }

  protected hint(): string {
    const min = this.adapter.toIso8601(this.min);
    const max = this.adapter.toIso8601(this.max);
    return this.locale() === 'ar-SA'
      ? `يوم الجمعة غير متاح. النطاق ${min}–${max}.`
      : `Fridays are unavailable. Range ${min}–${max}.`;
  }

  protected error(): string {
    return this.locale() === 'ar-SA'
      ? 'أدخل تاريخًا داخل النطاق. يوم الجمعة غير متاح.'
      : 'Enter a date inside the range. Fridays stay unavailable.';
  }

  protected equivalent(): string {
    const value = this.date.value;
    if (value == null || !this.adapter.isValid(value)) {
      return 'The field value is not a valid date.';
    }

    const other = this.calendar === 'islamic-umalqura' ? 'gregorian' : 'islamic-umalqura';
    const converted = convertCalendarDate(value, other);
    return `${this.calendarTitle()} ${this.adapter.toIso8601(value)} is ${this.otherTitle()} ${isoDate(converted)}.`;
  }

  private otherTitle(): string {
    return this.calendar === 'islamic-umalqura' ? 'Gregorian' : 'Umm al-Qura';
  }
}

@Component({
  selector: 'umalqura-demo',
  imports: [CalendarDemo],
  providers: [
    { provide: DEMO_CALENDAR, useValue: 'islamic-umalqura' },
    provideHijriDateAdapter({
      calendar: CalendarCode.umalqura,
      locale: CalendarLocale.arSA,
      timeZone: 'UTC',
    }),
  ],
  template: '<calendar-demo />',
})
export class UmalquraDemo {}

@Component({
  selector: 'gregorian-demo',
  imports: [CalendarDemo],
  providers: [
    { provide: DEMO_CALENDAR, useValue: 'gregorian' },
    provideHijriDateAdapter({
      calendar: CalendarCode.gregorian,
      locale: CalendarLocale.enUS,
      timeZone: 'UTC',
    }),
  ],
  template: '<calendar-demo />',
})
export class GregorianDemo {}

function isoDate(date: CalendarDate): string {
  const year = String(date.year).padStart(4, '0');
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
