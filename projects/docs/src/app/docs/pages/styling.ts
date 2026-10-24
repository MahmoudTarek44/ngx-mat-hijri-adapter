import { Component, DestroyRef, DOCUMENT, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CodeBlock } from '../../shared/code-block';
import { ExampleCard, type Snippet } from '../../shared/example-card';
import { StylingDemo } from './styling-demo';

const APP_WIDE = `@use '@angular/material' as mat;

html {
  @include mat.datepicker-overrides((
    toggle-icon-color: var(--mat-sys-tertiary),
    toggle-active-state-icon-color: var(--mat-sys-tertiary),
    calendar-container-shape: 24px,
    calendar-container-background-color: light-dark(
      color-mix(in srgb, var(--mat-sys-tertiary-container) 42%, white),
      var(--mat-sys-tertiary-container)
    ),
    calendar-date-selected-state-background-color: var(--mat-sys-tertiary),
    calendar-date-selected-state-text-color: var(--mat-sys-on-tertiary),
  ));
}`;

const LOCAL_SCSS = `${APP_WIDE}

.booking {
  @include mat.form-field-overrides((
    outlined-container-shape: 24px,
    outlined-outline-width: 2px,
    outlined-outline-color: var(--mat-sys-tertiary),
    outlined-hover-outline-color: var(--mat-sys-tertiary),
    outlined-focus-outline-color: var(--mat-sys-tertiary),
    outlined-label-text-color: var(--mat-sys-tertiary),
    outlined-focus-label-text-color: var(--mat-sys-tertiary),
    outlined-input-text-color: var(--mat-sys-on-tertiary-container),
  ));

  .mat-datepicker-toggle {
    margin-inline-end: 12px;
  }
}`;

const LOCAL_HTML = `<form class="booking">
  <ngx-mat-signal-date-field label="Date" [formField]="dateForm.date" />
</form>`;

const LOCAL_TS = `import { signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';
import { SignalDateField } from 'ngx-mat-hijri-adapter/signals';

@Component({
  imports: [FormField, SignalDateField],
  providers: [provideHijriDateAdapter({ calendar: 'gregorian', locale: 'en-US', timeZone: 'UTC' })],
  templateUrl: './date-field.html',
})
export class DateField {
  private readonly model = signal({ date: createCalendarDate('gregorian', 2024, 3, 11) });
  readonly dateForm = form(this.model);
}`;

@Component({
  selector: 'styling-page',
  imports: [ExampleCard, CodeBlock, StylingDemo, TranslatePipe],
  templateUrl: './styling.html',
})
export class StylingPage {
  private readonly root = inject(DOCUMENT).documentElement;
  protected readonly appWide = APP_WIDE;

  constructor() {
    this.root.classList.add('booking-calendar');
    inject(DestroyRef).onDestroy(() => this.root.classList.remove('booking-calendar'));
  }
  protected readonly snippets: readonly Snippet[] = [
    { label: 'TypeScript', language: 'ts', code: LOCAL_TS },
    { label: 'SCSS', language: 'scss', code: LOCAL_SCSS },
    { label: 'HTML', language: 'html', code: LOCAL_HTML },
  ];
}


