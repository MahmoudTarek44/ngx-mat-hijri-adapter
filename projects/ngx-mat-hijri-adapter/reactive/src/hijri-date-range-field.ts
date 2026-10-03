import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  type ValidationErrors,
} from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import {
  MatDateRangeInput,
  MatDateRangePicker,
  MatDatepickerToggle,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import type { CalendarDate } from '@internationalized/date';
import { HijriDateAdapter, type SupportedCalendar } from 'ngx-mat-hijri-adapter';

import {
  type ɵCalendarDateRange as CalendarDateRange,
  ɵconvertOrNull as convertOrNull,
  ɵequivalentText as equivalentText,
  ɵprovideFieldDateFormats as provideFieldDateFormats,
  ɵreadCalendarDate as readCalendarDate,
  ɵsameValue as sameValue,
} from 'ngx-mat-hijri-adapter/internal';

import { ReactiveDateFieldBase } from './reactive-date-field-base';

/**
 * Material date range field for reactive forms. The form value is a {@link CalendarDateRange}
 * in `valueCalendar`. The calendar toggle changes only what is displayed and typed.
 */
@Component({
  selector: 'hijri-date-range-field',
  providers: [
    HijriDateAdapter,
    { provide: DateAdapter, useExisting: HijriDateAdapter },
    provideFieldDateFormats(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HijriDateRangeField),
      multi: true,
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => HijriDateRangeField), multi: true },
  ],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    MatSuffix,
    MatIconButton,
    MatDateRangeInput,
    MatDateRangePicker,
    MatStartDate,
    MatEndDate,
    MatDatepickerToggle,
  ],
  templateUrl: '../../internal/src/hijri-date-range-field.html',
  styleUrl: '../../internal/src/hijri-field.css',
})
export class HijriDateRangeField extends ReactiveDateFieldBase<CalendarDateRange> {
  /** Placeholder of the start input. */
  readonly startPlaceholder = input('');
  /** Placeholder of the end input. */
  readonly endPlaceholder = input('');

  protected readonly range = new FormGroup({
    start: new FormControl<CalendarDate | null>(null),
    end: new FormControl<CalendarDate | null>(null),
  });
  protected readonly shown = signal<CalendarDateRange>({ start: null, end: null });
  protected readonly equivalent = computed(() => {
    if (!this.calendarToggle() || !this.equivalentHint()) {
      return '';
    }

    const { start, end } = this.shown();
    const parts = [start, end].map((date) =>
      equivalentText(date, this.display(), this.activeLocale(), this.labels()),
    );
    return parts.filter(Boolean).join(' – ');
  });

  constructor() {
    super();
    this.range.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.switching) {
        return;
      }

      const next = this.range.getRawValue();
      const previous = this.shown();
      if (sameValue(next.start, previous.start) && sameValue(next.end, previous.end)) {
        this.revalidate();
        return;
      }

      this.shown.set(next);
      this.onChange({ start: this.toValue(next.start), end: this.toValue(next.end) });
    });
  }

  writeValue(value: unknown): void {
    const range = (value ?? {}) as Partial<CalendarDateRange>;
    const start = readCalendarDate(range.start, 'HijriDateRangeField');
    const end = readCalendarDate(range.end, 'HijriDateRangeField');
    this.show({
      start: start && this.adapter.clone(start),
      end: end && this.adapter.clone(end),
    });
  }

  protected showValueIn(calendar: SupportedCalendar): void {
    const { start, end } = this.range.getRawValue();
    this.show({ start: convertOrNull(start, calendar), end: convertOrNull(end, calendar) });
  }

  protected innerErrors(): ValidationErrors | null {
    const errors = {
      ...this.range.controls.start.errors,
      ...this.range.controls.end.errors,
    };
    return Object.keys(errors).length ? errors : null;
  }

  protected setInnerDisabled(disabled: boolean): void {
    if (disabled) {
      this.range.disable({ emitEvent: false });
    } else {
      this.range.enable({ emitEvent: false });
    }
  }

  private show(range: CalendarDateRange): void {
    this.shown.set(range);
    this.range.setValue(range, { emitEvent: false });
  }
}
