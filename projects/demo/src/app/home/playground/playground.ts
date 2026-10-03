import { Dir } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { DateAdapter, MatOption } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import type { CalendarDate } from '@internationalized/date';

import {
  CalendarCode,
  calendarToday,
  convertCalendarDate,
  HijriDateAdapter,
  provideHijriDateAdapter,
  type SupportedCalendar,
} from 'ngx-mat-hijri-adapter';
import {
  type CalendarDateRange,
  type DateFieldPeriod,
  ReactiveDateField,
  ReactiveDateRangeField,
} from 'ngx-mat-hijri-adapter/reactive';

import { CodeBlock } from '../../shared/code-block';
import { describeDate } from '../../shared/demo-controls';

type PlaygroundLocale = 'ar-SA' | 'en-US' | 'ar-EG';
type Direction = 'rtl' | 'ltr';

const TEXT = {
  ar: {
    picker: 'منتقي Material',
    field: 'تاريخ الموعد',
    range: 'فترة الإقامة',
    start: 'البداية',
    end: 'النهاية',
    errors: {
      required: 'التاريخ مطلوب.',
      matDatepickerParse: 'تعذّر قراءة التاريخ.',
      matDatepickerMin: 'التاريخ خارج جدول أم القرى.',
      matDatepickerMax: 'التاريخ خارج جدول أم القرى.',
      matDatepickerFilter: 'هذا التاريخ غير متاح.',
      matEndDateInvalid: 'النهاية قبل البداية.',
    },
  },
  en: {
    picker: 'Material datepicker',
    field: 'Appointment',
    range: 'Stay',
    start: 'Start',
    end: 'End',
    errors: {
      required: 'A date is required.',
      matDatepickerParse: 'That date could not be read.',
      matDatepickerMin: 'That date is outside the Umm al-Qura table.',
      matDatepickerMax: 'That date is outside the Umm al-Qura table.',
      matDatepickerFilter: 'That date is not available.',
      matEndDateInvalid: 'The end is before the start.',
    },
  },
} as const;

@Component({
  selector: 'playground',
  imports: [
    Dir,
    ReactiveFormsModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatFormField,
    MatLabel,
    MatHint,
    MatSuffix,
    MatInput,
    MatSelect,
    MatOption,
    MatSlideToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    ReactiveDateField,
    ReactiveDateRangeField,
    CodeBlock,
  ],
  providers: [provideHijriDateAdapter({ timeZone: 'UTC' })],
  host: {
    class:
      'grid grid-cols-1 overflow-hidden rounded-card border bg-surface-container-low lg:grid-cols-[20rem_minmax(0,1fr)]',
  },
  templateUrl: './playground.html',
})
export class Playground {
  private readonly adapter = inject(DateAdapter) as HijriDateAdapter;

  protected readonly calendarCode = CalendarCode;
  protected readonly locales: readonly { value: PlaygroundLocale; label: string }[] = [
    { value: 'ar-SA', label: 'ar-SA · العربية (السعودية)' },
    { value: 'ar-EG', label: 'ar-EG · العربية (مصر)' },
    { value: 'en-US', label: 'en-US · English' },
  ];

  protected readonly calendar = signal<SupportedCalendar>(CalendarCode.umalqura);
  protected readonly locale = signal<PlaygroundLocale>('ar-SA');
  protected readonly direction = signal<Direction>('rtl');
  protected readonly calendarToggle = signal(true);
  protected readonly equivalentHint = signal(true);
  protected readonly period = signal<DateFieldPeriod>('all');
  protected readonly touchUi = signal(false);
  protected readonly text = computed(() => (this.locale().startsWith('ar') ? TEXT.ar : TEXT.en));

  protected readonly pickerDate = new FormControl<CalendarDate | null>(this.today());
  protected readonly fieldDate = new FormControl<CalendarDate | null>(this.today());
  protected readonly range = new FormControl<CalendarDateRange>(
    { start: null, end: null },
    { nonNullable: true },
  );

  private readonly pickerValue = toSignal(this.pickerDate.valueChanges, {
    initialValue: this.pickerDate.value,
  });
  private readonly fieldValue = toSignal(this.fieldDate.valueChanges, {
    initialValue: this.fieldDate.value,
  });
  private readonly rangeValue = toSignal(this.range.valueChanges, {
    initialValue: this.range.value,
  });
  protected readonly values = computed(() => [
    { label: 'Datepicker', value: describeDate(this.pickerValue()) },
    { label: 'Date field', value: describeDate(this.fieldValue()) },
    {
      label: 'Range field',
      value: `${describeDate(this.rangeValue()?.start)} → ${describeDate(this.rangeValue()?.end)}`,
    },
  ]);

  protected readonly providerSnippet = computed(() => {
    const calendar =
      this.calendar() === CalendarCode.umalqura
        ? 'CalendarCode.umalqura'
        : 'CalendarCode.gregorian';
    return `providers: [
  provideHijriDateAdapter({ calendar: ${calendar}, locale: '${this.locale()}' }),
],`;
  });

  protected readonly templateSnippet = computed(() => {
    const attributes = ['formControlName="appointment"', `label="${this.text().field}"`];
    if (this.calendarToggle()) {
      attributes.push('calendarToggle');
    }
    if (!this.equivalentHint()) {
      attributes.push('[equivalentHint]="false"');
    }
    if (this.period() !== 'all') {
      attributes.push(`period="${this.period()}"`);
    }
    if (this.touchUi()) {
      attributes.push('touchUi');
    }

    const field = ['<ngx-mat-reactive-date-field', ...attributes.map((a) => `  ${a}`), '/>'];
    if (this.direction() === 'ltr') {
      return field.join('\n');
    }

    return ['<div dir="rtl">', ...field.map((line) => `  ${line}`), '</div>'].join('\n');
  });

  constructor() {
    effect(() => this.adapter.setLocale(this.locale()));
  }

  protected useCalendar(calendar: SupportedCalendar): void {
    this.calendar.set(calendar);
    this.adapter.setCalendar(calendar);
    this.pickerDate.setValue(convertOrNull(this.pickerDate.value, calendar));
    this.fieldDate.setValue(convertOrNull(this.fieldDate.value, calendar));
    const { start, end } = this.range.value;
    this.range.setValue({
      start: convertOrNull(start, calendar),
      end: convertOrNull(end, calendar),
    });
  }

  protected useLocale(locale: PlaygroundLocale): void {
    this.locale.set(locale);
    this.direction.set(locale.startsWith('ar') ? 'rtl' : 'ltr');
  }

  private today(): CalendarDate {
    return calendarToday(CalendarCode.umalqura, 'UTC');
  }
}

function convertOrNull(
  date: CalendarDate | null,
  calendar: SupportedCalendar,
): CalendarDate | null {
  if (!date) {
    return null;
  }

  try {
    return convertCalendarDate(date, calendar);
  } catch {
    return null;
  }
}
