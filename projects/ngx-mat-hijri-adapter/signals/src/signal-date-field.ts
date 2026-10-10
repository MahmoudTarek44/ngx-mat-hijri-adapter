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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  type FormValueControl,
  type ValidationError,
  transformedValue,
} from '@angular/forms/signals';
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
  ɵDateFieldCore as DateFieldCore,
  ɵconvertOrNull as convertOrNull,
  ɵequivalentText as equivalentText,
  ɵprovideFieldDateFormats as provideFieldDateFormats,
  ɵreadCalendarDate as readCalendarDate,
  ɵsameValue as sameValue,
} from 'ngx-mat-hijri-adapter/internal';

import { datepickerErrors, firstErrorMessage } from './signal-errors';

/**
 * Material datepicker field for signal forms. Bind it with `[formField]`. The value is a
 * `CalendarDate` in `valueCalendar`, or null. The calendar toggle changes only what is displayed
 * and typed. Datepicker errors are reported to the field as parse errors.
 */
@Component({
  selector: 'ngx-mat-signal-date-field',
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
    MatInput,
    MatIconButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
  ],
  templateUrl: '../../internal/src/date-field.html',
  styleUrl: '../../internal/src/date-field.css',
})
export class SignalDateField
  extends DateFieldCore
  implements FormValueControl<CalendarDate | null>
{
  /** The field value. */
  readonly value = model<CalendarDate | null>(null);
  /** Input placeholder. */
  readonly placeholder = input('');
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

  protected readonly input = new FormControl<CalendarDate | null>(null);
  private readonly shown = transformedValue(this.value, {
    parse: (date: CalendarDate | null) => {
      const value = this.toValue(date);
      return {
        value: sameValue(value, this.value()) ? undefined : value,
        error: datepickerErrors(this.input.errors),
      };
    },
    format: (value) => {
      const date = readCalendarDate(value, 'SignalDateField');
      return convertOrNull(date, this.display());
    },
  });
  protected readonly errorMessage = computed(() =>
    firstErrorMessage(this.errors(), this.errorMessages()),
  );
  protected readonly equivalent = computed(() =>
    this.calendarToggle() && this.equivalentHint()
      ? equivalentText(this.shown(), this.display(), this.activeLocale(), this.labels())
      : '',
  );

  constructor() {
    super();
    this.input.valueChanges.pipe(takeUntilDestroyed()).subscribe((date) => {
      if (!this.switching) {
        this.shown.set(date);
      }
    });

    effect(() => {
      const date = this.shown();
      untracked(() => {
        if (!sameValue(date, this.input.value)) {
          this.input.setValue(date, { emitEvent: false });
        }
      });
    });

    effect(() => {
      if (this.disabled()) {
        this.input.disable({ emitEvent: false });
      } else {
        this.input.enable({ emitEvent: false });
      }
    });

    effect(() => {
      const value = this.value();
      const calendar = this.resolvedValueCalendar();
      if (value && !convertOrNull(value, calendar)) {
        untracked(() => this.value.set(null));
      }
    });
  }

  protected showValueIn(calendar: SupportedCalendar): void {
    const current = this.value();
    const next = convertOrNull(current, calendar);
    this.input.setValue(next, { emitEvent: false });
    if (current && !next) {
      this.value.set(null);
    }
  }

  protected isErrorState(): boolean {
    return this.invalid() && this.touched();
  }

  protected notifyTouched(): void {
    this.touch.emit();
  }
}
