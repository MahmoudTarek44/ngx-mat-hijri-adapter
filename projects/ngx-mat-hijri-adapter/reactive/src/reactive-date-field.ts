import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  type ValidationErrors,
} from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import type { CalendarDate } from '@internationalized/date';
import { HijriDateAdapter, type SupportedCalendar } from 'ngx-mat-hijri-adapter';

import {
  ɵconvertOrNull as convertOrNull,
  ɵequivalentText as equivalentText,
  ɵprovideFieldDateFormats as provideFieldDateFormats,
  ɵreadCalendarDate as readCalendarDate,
  ɵsameValue as sameValue,
} from 'ngx-mat-hijri-adapter/internal';

import { ReactiveDateFieldBase } from './reactive-date-field-base';

/**
 * Material datepicker field for reactive forms. The form value is a `CalendarDate` in
 * `valueCalendar`, or null. The calendar toggle changes only what is displayed and typed.
 */
@Component({
  selector: 'ngx-mat-reactive-date-field',
  providers: [
    HijriDateAdapter,
    { provide: DateAdapter, useExisting: HijriDateAdapter },
    provideFieldDateFormats(),
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveDateField), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ReactiveDateField), multi: true },
  ],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    MatSuffix,
    MatInput,
    MatIconButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
  ],
  templateUrl: '../../internal/src/date-field.html',
  styleUrl: '../../internal/src/date-field.css',
})
export class ReactiveDateField extends ReactiveDateFieldBase<CalendarDate | null> {
  /** Input placeholder. */
  readonly placeholder = input('');

  protected readonly input = new FormControl<CalendarDate | null>(null);
  protected readonly shown = signal<CalendarDate | null>(null);
  private stored: CalendarDate | null = null;
  protected readonly equivalent = computed(() =>
    this.calendarToggle() && this.equivalentHint()
      ? equivalentText(this.shown(), this.display(), this.activeLocale(), this.labels())
      : '',
  );

  constructor() {
    super();
    this.input.valueChanges.pipe(takeUntilDestroyed()).subscribe((date) => {
      if (this.switching) {
        return;
      }

      if (sameValue(date, this.shown())) {
        this.revalidate();
        return;
      }

      this.shown.set(date);
      this.stored = this.toValue(date);
      this.onChange(this.stored);
    });
  }

  writeValue(value: unknown): void {
    const date = readCalendarDate(value, 'ReactiveDateField');
    if (date && !convertOrNull(date, this.resolvedValueCalendar())) {
      this.stored = null;
      this.show(null);
      this.onChange(null);
      return;
    }

    this.stored = date;
    this.show(convertOrNull(date, this.display()));
  }

  protected showValueIn(calendar: SupportedCalendar): void {
    const next = convertOrNull(this.stored, calendar);
    this.show(next);
    if (this.stored && !next) {
      this.stored = null;
      this.onChange(null);
    }
  }

  protected innerErrors(): ValidationErrors | null {
    return this.input.errors;
  }

  protected setInnerDisabled(disabled: boolean): void {
    if (disabled) {
      this.input.disable({ emitEvent: false });
    } else {
      this.input.enable({ emitEvent: false });
    }
  }

  private show(date: CalendarDate | null): void {
    this.shown.set(date);
    this.input.setValue(date, { emitEvent: false });
  }
}
