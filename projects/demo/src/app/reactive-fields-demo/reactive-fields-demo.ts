import { Dir } from '@angular/cdk/bidi';
import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { CalendarDate } from '@internationalized/date';

import {
  CalendarCode,
  CalendarLocale,
  createCalendarDate,
  provideHijriDateAdapter,
} from 'ngx-mat-hijri-adapter';
import {
  type CalendarDateRange,
  ReactiveDateField,
  ReactiveDateRangeField,
} from 'ngx-mat-hijri-adapter/reactive';

type DemoLocale = 'ar-SA' | 'en-US';
type DemoDirection = 'rtl' | 'ltr';

const TEXT = {
  'ar-SA': {
    title: 'حقول النماذج التفاعلية',
    date: 'تاريخ الموعد',
    range: 'فترة الإقامة',
    start: 'البداية',
    end: 'النهاية',
    errors: {
      required: 'التاريخ مطلوب.',
      matDatepickerParse: 'تعذّر قراءة التاريخ.',
      matDatepickerMin: 'التاريخ خارج جدول أم القرى.',
      matDatepickerMax: 'التاريخ خارج جدول أم القرى.',
      matDatepickerFilter: 'يوم الجمعة غير متاح.',
      matStartDateInvalid: 'البداية بعد النهاية.',
      matEndDateInvalid: 'النهاية قبل البداية.',
    },
  },
  'en-US': {
    title: 'Reactive form fields',
    date: 'Appointment',
    range: 'Stay',
    start: 'Start',
    end: 'End',
    errors: {
      required: 'A date is required.',
      matDatepickerParse: 'That date could not be read.',
      matDatepickerMin: 'That date is outside the Umm al-Qura table.',
      matDatepickerMax: 'That date is outside the Umm al-Qura table.',
      matDatepickerFilter: 'Fridays are unavailable.',
      matStartDateInvalid: 'The start is after the end.',
      matEndDateInvalid: 'The end is before the start.',
    },
  },
} as const;

@Component({
  selector: 'reactive-fields-demo',
  imports: [Dir, ReactiveFormsModule, ReactiveDateField, ReactiveDateRangeField],
  providers: [provideHijriDateAdapter({ locale: CalendarLocale.arSA, timeZone: 'UTC' })],
  templateUrl: './reactive-fields-demo.html',
  styleUrl: '../calendar-demo/calendar-demo.css',
})
export class ReactiveFieldsDemo {
  protected readonly locale = signal<DemoLocale>(CalendarLocale.arSA);
  protected readonly direction = signal<DemoDirection>('rtl');
  protected readonly text = computed(() => TEXT[this.locale()]);

  protected readonly form = new FormGroup({
    appointment: new FormControl<CalendarDate | null>(
      createCalendarDate(CalendarCode.umalqura, 1445, 9, 1),
      Validators.required,
    ),
    stay: new FormControl<CalendarDateRange>({
      start: createCalendarDate(CalendarCode.gregorian, 2024, 3, 11),
      end: createCalendarDate(CalendarCode.gregorian, 2024, 3, 20),
    }),
  });

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.value });
  protected readonly appointmentValue = computed(() => describe(this.value().appointment));
  protected readonly stayValue = computed(() => {
    const stay = this.value().stay;
    return `${describe(stay?.start)} → ${describe(stay?.end)}`;
  });

  protected readonly notFriday = (date: CalendarDate): boolean =>
    date.toDate('UTC').getUTCDay() !== 5;

  protected useLocale(locale: DemoLocale): void {
    this.locale.set(locale);
  }

  protected useDirection(direction: DemoDirection): void {
    this.direction.set(direction);
  }
}

function describe(date: CalendarDate | null | undefined): string {
  if (!date) {
    return 'null';
  }

  const pad = (value: number, size = 2) => String(value).padStart(size, '0');
  const calendar = date.calendar.identifier === 'gregory' ? 'gregorian' : date.calendar.identifier;
  return `${calendar} ${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}
