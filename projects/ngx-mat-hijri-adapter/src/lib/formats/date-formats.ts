import type { MatDateFormats } from '@angular/material/core';

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
    dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
    timeInput: { hour: 'numeric', minute: 'numeric' },
    timeOptionLabel: { hour: 'numeric', minute: 'numeric' },
  },
};
