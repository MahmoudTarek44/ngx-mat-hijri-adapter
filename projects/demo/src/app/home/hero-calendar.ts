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
  host: {
    class:
      'block w-full max-w-96 justify-self-center rounded-card border bg-surface-container-low p-5 shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--color-primary)_45%,transparent)]',
  },
  template: `
    <div class="mb-2 flex items-center justify-between gap-4">
      <span class="text-label-large tracking-[0.08em] text-primary uppercase">Live preview</span>
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
    <p
      class="mt-3 rounded-[14px] bg-primary-container px-4 py-3 text-center text-body-medium text-on-primary-container"
    >
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
