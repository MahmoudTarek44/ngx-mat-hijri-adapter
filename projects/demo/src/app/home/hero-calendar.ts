import { Dir } from '@angular/cdk/bidi';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import type { CalendarDate } from '@internationalized/date';

import {
  CalendarCode,
  CalendarLocale,
  convertCalendarDate,
  createCalendarDate,
  formatCalendarDate,
  HijriDateAdapter,
  provideHijriDateAdapter,
  type SupportedCalendar,
} from 'ngx-mat-hijri-adapter';

const LONG_DATE = { day: 'numeric', month: 'long', year: 'numeric' } as const;

/** An inline Material calendar that switches between Umm al-Qura and Gregorian. */
@Component({
  selector: 'hero-calendar',
  imports: [Dir, MatCalendar, MatButtonToggleGroup, MatButtonToggle],
  providers: [
    provideHijriDateAdapter({
      calendar: CalendarCode.umalqura,
      locale: CalendarLocale.arSA,
      timeZone: 'UTC',
    }),
  ],
  host: { class: 'hero-calendar surface-card' },
  template: `
    <div class="hero-calendar-head">
      <span class="eyebrow">Live preview</span>
      <mat-button-toggle-group
        hideSingleSelectionIndicator
        aria-label="Calendar"
        [value]="calendar()"
        (change)="useCalendar($event.value)"
      >
        <mat-button-toggle [value]="calendarCode.umalqura">Hijri</mat-button-toggle>
        <mat-button-toggle [value]="calendarCode.gregorian">Gregorian</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div dir="rtl" lang="ar-SA">
      <mat-calendar
        [startAt]="selected()"
        [selected]="selected()"
        (selectedChange)="select($event)"
      />
    </div>
    <p class="hero-equivalent">
      <span lang="ar-SA" dir="rtl">{{ hijriText() }}</span>
      <br />
      <span>{{ gregorianText() }}</span>
    </p>
  `,
})
export class HeroCalendar {
  private readonly adapter = inject(DateAdapter) as HijriDateAdapter;

  protected readonly calendarCode = CalendarCode;
  protected readonly calendar = signal<SupportedCalendar>(CalendarCode.umalqura);
  protected readonly selected = signal<CalendarDate>(
    createCalendarDate(CalendarCode.umalqura, 1445, 9, 1),
  );
  protected readonly hijriText = computed(() =>
    formatCalendarDate(
      convertCalendarDate(this.selected(), CalendarCode.umalqura),
      CalendarLocale.arSA,
      LONG_DATE,
    ),
  );
  protected readonly gregorianText = computed(() =>
    formatCalendarDate(
      convertCalendarDate(this.selected(), CalendarCode.gregorian),
      CalendarLocale.enUS,
      LONG_DATE,
    ),
  );

  protected useCalendar(calendar: SupportedCalendar): void {
    this.adapter.setCalendar(calendar);
    this.calendar.set(calendar);
    this.selected.update((date) => convertCalendarDate(date, calendar));
  }

  protected select(date: CalendarDate | null): void {
    if (date) {
      this.selected.set(date);
    }
  }
}
