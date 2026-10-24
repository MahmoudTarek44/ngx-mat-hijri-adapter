import { Component, computed, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import type { CalendarDate } from '@internationalized/date';

import { createCalendarDate, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';
import { SignalDateField } from 'ngx-mat-hijri-adapter/signals';

import { describeDate } from '../../shared/demo-controls';

@Component({
  selector: 'calendar-toggle-demo',
  imports: [FormField, SignalDateField, MatIconButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger],
  providers: [provideHijriDateAdapter({ calendar: 'gregorian', locale: 'en-US', timeZone: 'UTC' })],
  styles: `
    button[role='menuitemradio'][aria-checked='true'] {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-primary);
    }
  `,
  template: `
    <section class="grid grid-cols-1 gap-4 px-6 pt-5 pb-6 *:w-full">
      <ngx-mat-signal-date-field label="Date" [formField]="dateForm.date" valueCalendar="gregorian">
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
      </ngx-mat-signal-date-field>
      <output
        class="-mt-1 block rounded-[10px] bg-surface-container-high px-3 py-2 font-mono text-body-small text-on-surface-variant"
        dir="ltr"
        >{{ stored() }}</output
      >
    </section>
  `,
})
export class CalendarToggleDemo {
  private readonly model = signal<{ date: CalendarDate | null }>({
    date: createCalendarDate('gregorian', 2024, 3, 11),
  });
  protected readonly dateForm = form(this.model);
  protected readonly stored = computed(() => describeDate(this.model().date));
}
