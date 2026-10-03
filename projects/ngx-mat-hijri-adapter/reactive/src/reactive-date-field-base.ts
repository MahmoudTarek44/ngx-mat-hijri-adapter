import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  Injector,
  afterNextRender,
  afterRenderEffect,
  computed,
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

import { ɵDateFieldCore as DateFieldCore } from 'ngx-mat-hijri-adapter/internal';

/** Connects a field to reactive forms as a `ControlValueAccessor` and `Validator`. */
@Directive()
export abstract class ReactiveDateFieldBase<TValue>
  extends DateFieldCore
  implements ControlValueAccessor, Validator
{
  private readonly injector = inject(Injector);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly parentForm =
    inject(FormGroupDirective, { optional: true }) ?? inject(NgForm, { optional: true });

  /**
   * Messages keyed by validation error. Datepicker errors such as `matDatepickerParse` take
   * precedence over the form control's own validators, such as `required`.
   */
  readonly errors = input<Record<string, string>>({});

  protected readonly disabled = signal(false);
  private readonly controlErrors = signal<ValidationErrors | null>(null);
  protected readonly errorMessage = computed(() => {
    const errors = this.controlErrors();
    const messages = this.errors();
    const key = Object.keys(errors ?? {}).find((name) => messages[name] !== undefined);
    return key === undefined ? '' : (messages[key] ?? '');
  });

  protected onChange: (value: TValue) => void = () => {};
  private onTouched: () => void = () => {};
  private validatorChange?: () => void;

  constructor() {
    super();

    afterRenderEffect(() => {
      this.pickerMin();
      this.pickerMax();
      this.filter();
      untracked(() => this.revalidate());
    });

    afterNextRender(() => this.watchControl());
  }

  abstract writeValue(value: unknown): void;

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

  protected isErrorState(): boolean {
    const control = this.control();
    return !!control?.invalid && (control.touched || !!this.parentForm?.submitted);
  }

  protected notifyTouched(): void {
    this.onTouched();
  }

  protected revalidate(): void {
    this.validatorChange?.();
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
