import { Dir } from '@angular/cdk/bidi';
import { Component, computed, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import type { CalendarDate } from '@internationalized/date';

import {
  CalendarCode,
  CalendarLocale,
  createCalendarDate,
  provideHijriDateAdapter,
} from 'ngx-mat-hijri-adapter';
import {
  type CalendarDateRange,
  SignalDateField,
  SignalDateRangeField,
} from 'ngx-mat-hijri-adapter/signals';

type DemoLocale = 'ar-SA' | 'en-US';
type DemoDirection = 'rtl' | 'ltr';

interface Booking {
  appointment: CalendarDate | null;
  stay: CalendarDateRange;
}

const TEXT = {
  'ar-SA': {
    title: 'حقول نماذج الإشارات',
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
    title: 'Signal form fields',
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
  selector: 'signal-fields-demo',
  imports: [Dir, FormField, SignalDateField, SignalDateRangeField],
  providers: [provideHijriDateAdapter({ locale: CalendarLocale.arSA, timeZone: 'UTC' })],
  templateUrl: './signal-fields-demo.html',
  styleUrl: '../calendar-demo/calendar-demo.css',
})
export class SignalFieldsDemo {
  protected readonly locale = signal<DemoLocale>('ar-SA');
  protected readonly direction = signal<DemoDirection>('rtl');
  protected readonly text = computed(() => TEXT[this.locale()]);

  private readonly booking = signal<Booking>({
    appointment: createCalendarDate(CalendarCode.umalqura, 1445, 9, 1),
    stay: {
      start: createCalendarDate(CalendarCode.gregorian, 2024, 3, 11),
      end: createCalendarDate(CalendarCode.gregorian, 2024, 3, 20),
    },
  });
  protected readonly form = form(this.booking, (path) => required(path.appointment));

  protected readonly appointmentValue = computed(() => describe(this.booking().appointment));
  protected readonly stayValue = computed(() => {
    const stay = this.booking().stay;
    return `${describe(stay.start)} → ${describe(stay.end)}`;
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

function describe(date: CalendarDate | null): string {
  if (!date) {
    return 'null';
  }

  const pad = (value: number, size = 2) => String(value).padStart(size, '0');
  const calendar = date.calendar.identifier === 'gregory' ? 'gregorian' : date.calendar.identifier;
  return `${calendar} ${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}
