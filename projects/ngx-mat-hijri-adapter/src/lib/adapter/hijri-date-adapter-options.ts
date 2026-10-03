import { InjectionToken } from '@angular/core';

import type { SupportedCalendar } from '../calendar/supported-calendars';

/** Construction options for {@link HijriDateAdapter}. Locale does not select the calendar. */
export interface HijriDateAdapterOptions {
  /** Calendar that owns `createDate`, parsing, and formatting. Defaults to `islamic-umalqura`. */
  calendar?: SupportedCalendar;
  /** Locale for digits, Gregorian month names, weekday names, and week start. Defaults to `ar-SA`. */
  locale?: string;
  /** Time zone used by `today()`. Defaults to the runtime time zone. */
  timeZone?: string;
}

export const HIJRI_DATE_ADAPTER_OPTIONS = new InjectionToken<HijriDateAdapterOptions>(
  'HIJRI_DATE_ADAPTER_OPTIONS',
);
