import {
  Directive,
  type Signal,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
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

/**
 * Calendar switching, bounds, filtering, and labels shared by the reactive and signal fields.
 * Subclasses connect the displayed value to a form.
 */
@Directive()
export abstract class DateFieldCore {
  protected readonly adapter = inject(HijriDateAdapter);
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
  readonly minDate = input<CalendarDate | null>();
  /** Latest selectable day, in any supported calendar. */
  readonly maxDate = input<CalendarDate | null>();
  /** Restricts days relative to today. */
  readonly period = input<HijriDatePeriod>('all');
  /** Extra day filter. It receives dates in the value calendar. */
  readonly dateFilter = input<((date: CalendarDate) => boolean) | null>(null);
  /** Opens the calendar in a dialog instead of a popup. */
  readonly touchUi = input(false, { transform: booleanAttribute });
  /** Overrides the toggle and hint text. */
  readonly calendarLabels = input<Partial<HijriCalendarLabels>>({});

  protected readonly display = signal<SupportedCalendar>(this.defaultCalendar);
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
    pickerBound('min', this.minDate(), this.display(), this.umalqura()),
  );
  protected readonly pickerMax = computed(() =>
    pickerBound('max', this.maxDate(), this.display(), this.umalqura()),
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
  protected readonly errorState: ErrorStateMatcher = {
    isErrorState: () => this.isErrorState(),
  };

  /** True while the displayed calendar changes, when Material re-emits the same day. */
  protected switching = false;
  private started = false;

  /** Whether the inner inputs and calendar buttons are disabled. */
  protected abstract readonly disabled: Signal<boolean>;
  /** Text of the `mat-error`, or an empty string. */
  protected abstract readonly errorMessage: Signal<string>;

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
  }

  /** Re-expresses the displayed value in `calendar` without changing the form value. */
  protected abstract showValueIn(calendar: SupportedCalendar): void;

  protected abstract isErrorState(): boolean;

  protected abstract notifyTouched(): void;

  protected openIn(calendar: SupportedCalendar, picker: { open(): void }): void {
    this.showCalendar(calendar);
    picker.open();
  }

  protected markTouched(): void {
    this.notifyTouched();
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
}
