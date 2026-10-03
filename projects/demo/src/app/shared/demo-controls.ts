import { Component, model } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import type { CalendarDate } from '@internationalized/date';

export type DemoLocale = 'ar-SA' | 'en-US';
export type DemoDirection = 'rtl' | 'ltr';

/** Locale and direction switches shared by the example cards. */
@Component({
  selector: 'demo-controls',
  imports: [MatButtonToggleGroup, MatButtonToggle],
  host: { class: 'demo-controls' },
  template: `
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      aria-label="Locale"
      [value]="locale()"
      (change)="locale.set($event.value)"
    >
      <mat-button-toggle value="ar-SA" data-locale="ar-SA" lang="ar">العربية</mat-button-toggle>
      <mat-button-toggle value="en-US" data-locale="en-US">English</mat-button-toggle>
    </mat-button-toggle-group>
    <mat-button-toggle-group
      hideSingleSelectionIndicator
      aria-label="Direction"
      [value]="direction()"
      (change)="direction.set($event.value)"
    >
      <mat-button-toggle value="rtl" data-direction="rtl">RTL</mat-button-toggle>
      <mat-button-toggle value="ltr" data-direction="ltr">LTR</mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class DemoControls {
  readonly locale = model.required<DemoLocale>();
  readonly direction = model.required<DemoDirection>();
}

/** `calendar YYYY-MM-DD` with the package's calendar name, or `null`. */
export function describeDate(date: CalendarDate | null | undefined): string {
  if (!date) {
    return 'null';
  }

  const pad = (value: number, size = 2) => String(value).padStart(size, '0');
  const calendar = date.calendar.identifier === 'gregory' ? 'gregorian' : date.calendar.identifier;
  return `${calendar} ${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}
