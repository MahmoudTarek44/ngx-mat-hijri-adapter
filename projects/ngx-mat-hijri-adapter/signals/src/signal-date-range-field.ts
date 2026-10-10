import {
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  type FormValueControl,
  type ValidationError,
  transformedValue,
} from '@angular/forms/signals';
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
  ɵDateFieldCore as DateFieldCore,
  ɵconvertOrNull as convertOrNull,
  ɵequivalentText as equivalentText,
  ɵprovideFieldDateFormats as provideFieldDateFormats,
  ɵreadCalendarDate as readCalendarDate,
  ɵsameValue as sameValue,
} from 'ngx-mat-hijri-adapter/internal';

import { datepickerErrors, firstErrorMessage } from './signal-errors';

const EMPTY_RANGE: CalendarDateRange = { start: null, end: null };

/**
 * Material date range field for signal forms. Bind it with `[formField]`. The value is a
 * `CalendarDateRange` in `valueCalendar`. The calendar toggle changes only what is displayed and
 * typed. Datepicker errors are reported to the field as parse errors.
 */
@Component({
  selector: 'ngx-mat-signal-date-range-field',
  providers: [
    HijriDateAdapter,
    { provide: DateAdapter, useExisting: HijriDateAdapter },
    provideFieldDateFormats(),
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
  templateUrl: '../../internal/src/date-range-field.html',
  styleUrl: '../../internal/src/date-field.css',
})
export class SignalDateRangeField
  extends DateFieldCore
  implements FormValueControl<CalendarDateRange>
{
  /** The field value. */
  readonly value = model<CalendarDateRange>(EMPTY_RANGE);
  /** Placeholder of the start input. */
  readonly startPlaceholder = input('');
  /** Placeholder of the end input. */
  readonly endPlaceholder = input('');
  /** Bound from the field. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Bound from the field. */
  readonly touched = input(false, { transform: booleanAttribute });
  /** Bound from the field. */
  readonly invalid = input(false, { transform: booleanAttribute });
  /** Bound from the field. */
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  /** Messages keyed by error kind. A message here replaces the error's own `message`. */
  readonly errorMessages = input<Record<string, string>>({});
  /** Marks the field touched on blur and when the picker closes. */
  readonly touch = output<void>();

  protected readonly range = new FormGroup({
    start: new FormControl<CalendarDate | null>(null),
    end: new FormControl<CalendarDate | null>(null),
  });
  private readonly shown = transformedValue(this.value, {
    parse: (range: CalendarDateRange) => {
      const current = this.value();
      const value = { start: this.toValue(range.start), end: this.toValue(range.end) };
      const same = sameValue(value.start, current.start) && sameValue(value.end, current.end);
      return {
        value: same ? undefined : value,
        error: datepickerErrors({
          ...this.range.controls.start.errors,
          ...this.range.controls.end.errors,
        }),
      };
    },
    format: (value) => {
      const display = this.display();
      const start = readCalendarDate(value?.start, 'SignalDateRangeField');
      const end = readCalendarDate(value?.end, 'SignalDateRangeField');
      return {
        start: convertOrNull(start, display),
        end: convertOrNull(end, display),
      };
    },
  });
  protected readonly errorMessage = computed(() =>
    firstErrorMessage(this.errors(), this.errorMessages()),
  );
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
      if (!this.switching) {
        this.shown.set(this.range.getRawValue());
      }
    });

    effect(() => {
      const range = this.shown();
      untracked(() => {
        const inner = this.range.getRawValue();
        if (!sameValue(range.start, inner.start) || !sameValue(range.end, inner.end)) {
          this.range.setValue(range, { emitEvent: false });
        }
      });
    });

    effect(() => {
      if (this.disabled()) {
        this.range.disable({ emitEvent: false });
      } else {
        this.range.enable({ emitEvent: false });
      }
    });

    effect(() => {
      const value = this.value();
      const calendar = this.resolvedValueCalendar();
      const start = value.start && convertOrNull(value.start, calendar) ? value.start : null;
      const end = value.end && convertOrNull(value.end, calendar) ? value.end : null;
      if (start !== value.start || end !== value.end) {
        untracked(() => this.value.set({ start, end }));
      }
    });
  }

  protected showValueIn(calendar: SupportedCalendar): void {
    const current = this.value();
    const next = {
      start: convertOrNull(current.start, calendar),
      end: convertOrNull(current.end, calendar),
    };
    this.range.setValue(next, { emitEvent: false });
    if ((current.start && !next.start) || (current.end && !next.end)) {
      this.value.set({
        start: next.start ? current.start : null,
        end: next.end ? current.end : null,
      });
    }
  }

  protected isErrorState(): boolean {
    return this.invalid() && this.touched();
  }

  protected notifyTouched(): void {
    this.touch.emit();
  }
}
