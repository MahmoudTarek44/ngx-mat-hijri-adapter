import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  Injector,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type AbstractControl,
  type ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  type ValidationErrors,
  type Validator,
} from '@angular/forms';
import type { ErrorStateMatcher } from '@angular/material/core';
import type { CalendarDate } from '@internationalized/date';
import {
  HIJRI_DATE_ADAPTER_OPTIONS,
  HijriDateAdapter,
  type SupportedCalendar,
} from 'ngx-mat-hijri-adapter';

import {
  type HijriCalendarLabels,
  type HijriDatePeriod,
  calendarLabels,
  convertOrNull,
  periodAllows,
  pickerBound,
} from './field-support';

@Directive()
export abstract class HijriFieldBase<TValue> implements ControlValueAccessor, Validator {
  protected readonly adapter = inject(HijriDateAdapter);
  private readonly injector = inject(Injector);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly parentForm =
    inject(FormGroupDirective, { optional: true }) ?? inject(NgForm, { optional: true });
  private readonly defaultCalendar = this.adapter.calendar;
  private readonly defaultLocale =
    inject(HIJRI_DATE_ADAPTER_OPTIONS, { optional: true })?.locale ?? 'ar-SA';

  /** Floating label text. */
  readonly label = input<string>();
  /** Calendar of the form value. Defaults to the calendar from `provideHijriDateAdapter()`. */
  readonly valueCalendar = input<SupportedCalendar>();
  /** Shows Hijri and Gregorian buttons that switch the displayed calendar. */
  readonly calendarToggle = input(false, { transform: booleanAttribute });
  /** With the toggle on, shows the selected date in the calendar that is not displayed. */
  readonly equivalentHint = input(true, { transform: booleanAttribute });
  /** Locale for digits, names, and week start. Defaults to the provider locale. */
  readonly locale = input<string>();
  /** Earliest selectable day, in any supported calendar. */
  readonly min = input<CalendarDate | null>();
  /** Latest selectable day, in any supported calendar. */
  readonly max = input<CalendarDate | null>();
  /** Restricts days relative to today. */
  readonly period = input<HijriDatePeriod>('all');
  /** Extra day filter. It receives dates in the value calendar. */
  readonly dateFilter = input<((date: CalendarDate) => boolean) | null>(null);
  /** Opens the calendar in a dialog instead of a popup. */
  readonly touchUi = input(false, { transform: booleanAttribute });
  /**
   * Messages keyed by validation error. Datepicker errors such as `matDatepickerParse` take
   * precedence over the form control's own validators, such as `required`.
   */
  readonly errors = input<Record<string, string>>({});
  /** Overrides the toggle and hint text. */
  readonly calendarLabels = input<Partial<HijriCalendarLabels>>({});

  protected readonly display = signal<SupportedCalendar>(this.defaultCalendar);
  protected readonly disabled = signal(false);
  protected readonly activeLocale = computed(() => this.locale() ?? this.defaultLocale);
  protected readonly labels = computed(() =>
    calendarLabels(this.activeLocale(), this.calendarLabels()),
  );
  protected readonly resolvedValueCalendar = computed(
    () => this.valueCalendar() ?? this.defaultCalendar,
  );
  private readonly umalqura = computed(
    () => this.calendarToggle() || this.resolvedValueCalendar() === 'islamic-umalqura',
  );
  protected readonly pickerMin = computed(() =>
    pickerBound('min', this.min(), this.display(), this.umalqura()),
  );
  protected readonly pickerMax = computed(() =>
    pickerBound('max', this.max(), this.display(), this.umalqura()),
  );
  protected readonly filter = computed(() => {
    const period = this.period();
    const custom = this.dateFilter();
    const valueCalendar = this.resolvedValueCalendar();

    return (date: CalendarDate | null): boolean => {
      if (!date) {
        return true;
      }

      if (!periodAllows(date, period, this.adapter.today())) {
        return false;
      }

      if (!custom) {
        return true;
      }

      const value = convertOrNull(date, valueCalendar);
      return value !== null && custom(value);
    };
  });

  private readonly controlErrors = signal<ValidationErrors | null>(null);
  protected readonly errorMessage = computed(() => {
    const errors = this.controlErrors();
    const messages = this.errors();
    const key = Object.keys(errors ?? {}).find((name) => messages[name] !== undefined);
    return key === undefined ? '' : (messages[key] ?? '');
  });
  protected readonly errorState: ErrorStateMatcher = {
    isErrorState: () => {
      const control = this.control();
      return !!control?.invalid && (control.touched || !!this.parentForm?.submitted);
    },
  };

  protected onChange: (value: TValue) => void = () => {};
  /** True while the displayed calendar changes, when Material re-emits the same day. */
  protected switching = false;
  private onTouched: () => void = () => {};
  private validatorChange?: () => void;
  private started = false;

  constructor() {
    effect(() => this.adapter.setLocale(this.activeLocale()));

    effect(() => {
      const calendar = this.resolvedValueCalendar();
      const toggle = this.calendarToggle();
      untracked(() => {
        if (!toggle || !this.started) {
          this.showCalendar(calendar);
        }
        this.started = true;
      });
    });

    afterRenderEffect(() => {
      this.pickerMin();
      this.pickerMax();
      this.filter();
      untracked(() => this.revalidate());
    });

    afterNextRender(() => this.watchControl());
  }

  abstract writeValue(value: unknown): void;

  /** Re-expresses the displayed value in `calendar` without changing the form value. */
  protected abstract showValueIn(calendar: SupportedCalendar): void;

  protected abstract innerErrors(): ValidationErrors | null;

  protected abstract setInnerDisabled(disabled: boolean): void;

  registerOnChange(fn: (value: TValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
    this.setInnerDisabled(disabled);
  }

  validate(): ValidationErrors | null {
    return this.innerErrors();
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }

  protected openIn(calendar: SupportedCalendar, picker: { open(): void }): void {
    this.showCalendar(calendar);
    picker.open();
  }

  protected touch(): void {
    this.onTouched();
  }

  protected revalidate(): void {
    this.validatorChange?.();
  }

  protected toValue(date: CalendarDate | null): CalendarDate | null {
    return convertOrNull(date, this.resolvedValueCalendar());
  }

  private showCalendar(calendar: SupportedCalendar): void {
    if (calendar === this.display()) {
      return;
    }

    this.switching = true;
    try {
      this.adapter.setCalendar(calendar);
      this.display.set(calendar);
      this.showValueIn(calendar);
    } finally {
      this.switching = false;
    }
  }

  private control(): AbstractControl | null {
    return this.injector.get(NgControl, null, { self: true, optional: true })?.control ?? null;
  }

  private watchControl(): void {
    const control = this.control();
    if (!control) {
      return;
    }

    const refresh = () => {
      this.controlErrors.set(control.errors && { ...this.innerErrors(), ...control.errors });
      this.changeDetector.markForCheck();
    };
    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(refresh);
    this.parentForm?.ngSubmit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(refresh);
    refresh();
  }
}
