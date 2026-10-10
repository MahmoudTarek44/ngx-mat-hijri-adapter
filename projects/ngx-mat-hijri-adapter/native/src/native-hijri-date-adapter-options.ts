import { InjectionToken } from '@angular/core';
import type { SupportedCalendar } from 'ngx-mat-hijri-adapter';

/** Construction options for {@link NativeHijriDateAdapter}. Locale does not select the calendar. */
export interface NativeHijriDateAdapterOptions {
  /** Calendar that owns `createDate`, parsing, and formatting. Defaults to `islamic-umalqura`. */
  calendar?: SupportedCalendar;
  /** Locale for digits, month names, weekday names, and week start. Defaults to `ar-SA`. */
  locale?: string;
  /**
   * Week start, `0` for Sunday through `6` for Saturday.
   * Defaults to the locale's week info.
   */
  firstDayOfWeek?: number;
  /** Time zone used by `today()`. Defaults to the runtime time zone. */
  timeZone?: string;
}

export const NATIVE_HIJRI_DATE_ADAPTER_OPTIONS = new InjectionToken<NativeHijriDateAdapterOptions>(
  'NATIVE_HIJRI_DATE_ADAPTER_OPTIONS',
);
