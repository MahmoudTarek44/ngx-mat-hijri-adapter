import type { MatDateFormats } from '@angular/material/core';

/** Text shown in a date field input. */
export type DateDisplayFormat = 'numeric' | 'month-name';

/** `day/month/year`, such as `29/4/1448` or `10/10/2026`. */
export const NUMERIC_DATE_INPUT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

/** `day month, year`, such as `29 Rabi al-Thani, 1448` or `10 October, 2026`. */
export const MONTH_NAME_DATE_INPUT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/** Input options for {@link DateDisplayFormat}. Digits and month language follow the locale. */
export function dateInputOptions(format: DateDisplayFormat): Intl.DateTimeFormatOptions {
  return format === 'month-name' ? MONTH_NAME_DATE_INPUT : NUMERIC_DATE_INPUT;
}

/**
 * Display options for {@link HijriDateAdapter.format}.
 * Numeric dates render as day/month/year. Named dates render as `day month, year`.
 */
export const HIJRI_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: null,
    timeInput: null,
  },
  display: {
    dateInput: NUMERIC_DATE_INPUT,
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: MONTH_NAME_DATE_INPUT,
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
    timeInput: { hour: 'numeric', minute: 'numeric' },
    timeOptionLabel: { hour: 'numeric', minute: 'numeric' },
  },
};
