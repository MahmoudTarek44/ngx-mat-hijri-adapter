import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ExampleCard, type Snippet } from '../../shared/example-card';
import { CalendarToggleDemo } from './calendar-toggle-demo';

const HTML_SNIPPET = `<ngx-mat-signal-date-field label="Date" [formField]="dateForm.date" valueCalendar="gregorian">
  <ng-template #calendarToggle let-controller>
    <button
      type="button"
      mat-icon-button
      [matMenuTriggerFor]="calendarMenu"
      [disabled]="controller.disabled"
      [attr.aria-label]="
        controller.display === 'islamic-umalqura'
          ? controller.labels.hijriAriaLabel
          : controller.labels.gregorianAriaLabel
      "
    >
      <mat-icon aria-hidden="true">{{
        controller.display === 'islamic-umalqura' ? 'dark_mode' : 'add_circle_outline'
      }}</mat-icon>
    </button>
    <mat-menu #calendarMenu="matMenu">
      <button
        type="button"
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="controller.display === 'islamic-umalqura'"
        (click)="controller.open('islamic-umalqura')"
      >
        <mat-icon>dark_mode</mat-icon>
        <span>{{ controller.labels.hijriAriaLabel }}</span>
      </button>
      <button
        type="button"
        mat-menu-item
        role="menuitemradio"
        [attr.aria-checked]="controller.display === 'gregorian'"
        (click)="controller.open('gregorian')"
      >
        <mat-icon>add_circle_outline</mat-icon>
        <span>{{ controller.labels.gregorianAriaLabel }}</span>
      </button>
    </mat-menu>
  </ng-template>
</ngx-mat-signal-date-field>`;

const TYPESCRIPT_SNIPPET = `import { signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';
import { SignalDateField } from 'ngx-mat-hijri-adapter/signals';

@Component({
  imports: [FormField, SignalDateField, MatIconButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger],
  providers: [provideHijriDateAdapter({ calendar: 'gregorian', locale: 'en-US', timeZone: 'UTC' })],
  templateUrl: './date-field.html',
})
export class DateField {
  private readonly model = signal({ date: createCalendarDate('gregorian', 2024, 3, 11) });
  readonly dateForm = form(this.model);
}`;

@Component({
  selector: 'calendar-toggle-page',
  imports: [ExampleCard, CalendarToggleDemo, TranslatePipe],
  templateUrl: './calendar-toggle.html',
})
export class CalendarTogglePage {
  protected readonly snippets: readonly Snippet[] = [
    { label: 'TypeScript', language: 'ts', code: TYPESCRIPT_SNIPPET },
    { label: 'HTML', language: 'html', code: HTML_SNIPPET },
  ];
}

