import type { Snippet } from '../shared/example-card';

export const INSTALL_COMMAND = 'ng add ngx-mat-hijri-adapter';

export const MANUAL_INSTALL_COMMAND = 'npm install ngx-mat-hijri-adapter @internationalized/date';

export const UMALQURA_SNIPPETS: readonly Snippet[] = [
  {
    label: 'TypeScript',
    language: 'ts',
    code: `import { CalendarCode, CalendarLocale, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

@Component({
  selector: 'umalqura-picker',
  // Dir (from @angular/cdk/bidi) makes dir="rtl" reach the datepicker overlay too.
  imports: [Dir, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    provideHijriDateAdapter({ calendar: CalendarCode.umalqura, locale: CalendarLocale.arSA }),
  ],
  templateUrl: './umalqura-picker.html',
})
export class UmalquraPicker {
  private readonly adapter = inject<DateAdapter<CalendarDate>>(DateAdapter);

  readonly min = this.adapter.createDate(1445, 8, 1); // 1 Ramadan 1445, months are 0-based
  readonly max = this.adapter.createDate(1445, 8, 30);
  readonly date = new FormControl<CalendarDate | null>(this.min);

  readonly notFriday = (date: CalendarDate | null) =>
    date != null && this.adapter.getDayOfWeek(date) !== 5;
}`,
  },
  {
    label: 'HTML',
    language: 'html',
    code: `<mat-form-field appearance="outline" dir="rtl">
  <mat-label>التاريخ</mat-label>
  <input
    matInput
    [matDatepicker]="picker"
    [formControl]="date"
    [min]="min"
    [max]="max"
    [matDatepickerFilter]="notFriday"
  />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`,
  },
];

export const GREGORIAN_SNIPPETS: readonly Snippet[] = [
  {
    label: 'TypeScript',
    language: 'ts',
    code: `import { CalendarCode, CalendarLocale, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

@Component({
  selector: 'gregorian-picker',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    // The same adapter, in the Gregorian calendar. Locale never selects the calendar.
    provideHijriDateAdapter({ calendar: CalendarCode.gregorian, locale: CalendarLocale.enUS }),
  ],
  templateUrl: './gregorian-picker.html',
})
export class GregorianPicker {
  private readonly adapter = inject<DateAdapter<CalendarDate>>(DateAdapter);

  readonly min = this.adapter.createDate(2024, 2, 11); // 11 March 2024
  readonly max = this.adapter.createDate(2024, 2, 31);
  readonly date = new FormControl<CalendarDate | null>(this.min);
}`,
  },
  {
    label: 'HTML',
    language: 'html',
    code: `<mat-form-field appearance="outline">
  <mat-label>Date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="date" [min]="min" [max]="max" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`,
  },
];

export const NATIVE_UMALQURA_SNIPPETS: readonly Snippet[] = [
  {
    label: 'TypeScript',
    language: 'ts',
    code: `import { provideNativeHijriDateAdapter } from 'ngx-mat-hijri-adapter/native';

@Component({
  selector: 'umalqura-date-picker',
  // Dir (from @angular/cdk/bidi) makes dir="rtl" reach the datepicker overlay too.
  imports: [Dir, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    provideNativeHijriDateAdapter({ calendar: 'islamic-umalqura', locale: 'ar-SA', timeZone: 'UTC' }),
  ],
  templateUrl: './umalqura-date-picker.html',
})
export class UmalquraDatePicker {
  private readonly adapter = inject<DateAdapter<Date>>(DateAdapter);

  readonly min = this.adapter.createDate(1445, 8, 1); // 1 Ramadan 1445, stored at UTC noon
  readonly max = this.adapter.createDate(1445, 8, 30);
  readonly date = new FormControl<Date | null>(this.min);

  readonly notFriday = (date: Date | null) =>
    date != null && this.adapter.getDayOfWeek(date) !== 5;
}`,
  },
  {
    label: 'HTML',
    language: 'html',
    code: `<mat-form-field appearance="outline" dir="rtl">
  <mat-label>التاريخ</mat-label>
  <input
    matInput
    [matDatepicker]="picker"
    [formControl]="date"
    [min]="min"
    [max]="max"
    [matDatepickerFilter]="notFriday"
  />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`,
  },
];

export const NATIVE_GREGORIAN_SNIPPETS: readonly Snippet[] = [
  {
    label: 'TypeScript',
    language: 'ts',
    code: `import { provideNativeHijriDateAdapter } from 'ngx-mat-hijri-adapter/native';

@Component({
  selector: 'gregorian-date-picker',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    // The same native adapter, in the Gregorian calendar. Locale never selects the calendar.
    provideNativeHijriDateAdapter({ calendar: 'gregorian', locale: 'en-US', timeZone: 'UTC' }),
  ],
  templateUrl: './gregorian-date-picker.html',
})
export class GregorianDatePicker {
  private readonly adapter = inject<DateAdapter<Date>>(DateAdapter);

  readonly min = this.adapter.createDate(2024, 2, 11); // 11 March 2024, stored at UTC noon
  readonly max = this.adapter.createDate(2024, 2, 31);
  readonly date = new FormControl<Date | null>(this.min);
}`,
  },
  {
    label: 'HTML',
    language: 'html',
    code: `<mat-form-field appearance="outline">
  <mat-label>Date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="date" [min]="min" [max]="max" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`,
  },
];

export const REACTIVE_SNIPPETS: readonly Snippet[] = [
  {
    label: 'TypeScript',
    language: 'ts',
    code: `import { CalendarCode, createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';
import {
  type CalendarDateRange,
  ReactiveDateField,
  ReactiveDateRangeField,
} from 'ngx-mat-hijri-adapter/reactive';

@Component({
  selector: 'booking-form',
  imports: [ReactiveFormsModule, ReactiveDateField, ReactiveDateRangeField],
  providers: [provideHijriDateAdapter()],
  templateUrl: './booking-form.html',
})
export class BookingForm {
  readonly form = new FormGroup({
    appointment: new FormControl<CalendarDate | null>(
      createCalendarDate(CalendarCode.umalqura, 1445, 9, 1),
      Validators.required,
    ),
    stay: new FormControl<CalendarDateRange>({ start: null, end: null }),
  });
}`,
  },
  {
    label: 'HTML',
    language: 'html',
    code: `<form [formGroup]="form">
  <ngx-mat-reactive-date-field
    formControlName="appointment"
    label="Appointment"
    valueCalendar="islamic-umalqura"
    calendarToggle
    [errors]="{ required: 'A date is required.' }"
  />
  <ngx-mat-reactive-date-range-field
    formControlName="stay"
    label="Stay"
    valueCalendar="gregorian"
    calendarToggle
  />
</form>`,
  },
];

export const SIGNAL_SNIPPETS: readonly Snippet[] = [
  {
    label: 'TypeScript',
    language: 'ts',
    code: `import { FormField, form, required } from '@angular/forms/signals';
import { CalendarCode, createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';
import {
  type CalendarDateRange,
  SignalDateField,
  SignalDateRangeField,
} from 'ngx-mat-hijri-adapter/signals';

@Component({
  selector: 'booking-form',
  imports: [FormField, SignalDateField, SignalDateRangeField],
  providers: [provideHijriDateAdapter()],
  templateUrl: './booking-form.html',
})
export class BookingForm {
  private readonly booking = signal<{ appointment: CalendarDate | null; stay: CalendarDateRange }>({
    appointment: createCalendarDate(CalendarCode.umalqura, 1445, 9, 1),
    stay: { start: null, end: null },
  });
  readonly form = form(this.booking, (path) => required(path.appointment));
}`,
  },
  {
    label: 'HTML',
    language: 'html',
    code: `<ngx-mat-signal-date-field
  [formField]="form.appointment"
  label="Appointment"
  valueCalendar="islamic-umalqura"
  calendarToggle
  [errorMessages]="{ required: 'A date is required.' }"
/>
<ngx-mat-signal-date-range-field
  [formField]="form.stay"
  label="Stay"
  valueCalendar="gregorian"
  calendarToggle
/>`,
  },
];
