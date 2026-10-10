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

import { CalendarCode, CalendarLocale, type SupportedCalendar } from 'ngx-mat-hijri-adapter';
import { provideNativeHijriDateAdapter } from 'ngx-mat-hijri-adapter/native';

import { DemoControls, type DemoDirection, type DemoLocale } from '../../shared/demo-controls';

const NATIVE_DEMO_CALENDAR = new InjectionToken<SupportedCalendar>('NATIVE_DEMO_CALENDAR');

@Component({
  selector: 'native-demo',
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
  templateUrl: './native-demo.html',
})
export class NativeDemo {
  private readonly adapter = inject<DateAdapter<Date, string>>(DateAdapter);
  protected readonly calendar = inject(NATIVE_DEMO_CALENDAR);
  protected readonly locale = signal<DemoLocale>(this.calendar === 'gregorian' ? 'en-US' : 'ar-SA');
  protected readonly direction = signal<DemoDirection>(
    this.calendar === 'gregorian' ? 'ltr' : 'rtl',
  );
  protected readonly min: Date;
  protected readonly max: Date;
  protected readonly date: FormControl<Date | null>;

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

  protected readonly disableFridays = (date: Date | null): boolean =>
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
    return `${this.calendarTitle()} ${this.adapter.toIso8601(value)} is ${this.otherTitle()} ${isoInCalendar(value, other)}.`;
  }

  private otherTitle(): string {
    return this.calendar === 'islamic-umalqura' ? 'Gregorian' : 'Umm al-Qura';
  }
}

@Component({
  selector: 'native-umalqura-demo',
  imports: [NativeDemo],
  providers: [
    { provide: NATIVE_DEMO_CALENDAR, useValue: CalendarCode.umalqura },
    provideNativeHijriDateAdapter({
      calendar: CalendarCode.umalqura,
      locale: CalendarLocale.arSA,
      timeZone: 'UTC',
    }),
  ],
  template: '<native-demo />',
})
export class NativeUmalquraDemo {}

@Component({
  selector: 'native-gregorian-demo',
  imports: [NativeDemo],
  providers: [
    { provide: NATIVE_DEMO_CALENDAR, useValue: CalendarCode.gregorian },
    provideNativeHijriDateAdapter({
      calendar: CalendarCode.gregorian,
      locale: CalendarLocale.enUS,
      timeZone: 'UTC',
    }),
  ],
  template: '<native-demo />',
})
export class NativeGregorianDemo {}

function isoInCalendar(date: Date, calendar: SupportedCalendar): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    calendar: calendar === 'gregorian' ? 'gregory' : 'islamic-umalqura',
    day: '2-digit',
    month: '2-digit',
    numberingSystem: 'latn',
    timeZone: 'UTC',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year').padStart(4, '0')}-${value('month')}-${value('day')}`;
}
