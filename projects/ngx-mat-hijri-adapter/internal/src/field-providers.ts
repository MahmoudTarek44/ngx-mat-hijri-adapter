import { type Provider, inject } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HIJRI_DATE_FORMATS } from 'ngx-mat-hijri-adapter';

/**
 * A private copy of the app formats, so one field can change its input text
 * without changing every other datepicker.
 */
export function provideFieldDateFormats(): Provider {
  return {
    provide: MAT_DATE_FORMATS,
    useFactory: () => {
      const source =
        inject(MAT_DATE_FORMATS, { optional: true, skipSelf: true }) ?? HIJRI_DATE_FORMATS;
      return {
        parse: { ...source.parse },
        display: { ...source.display },
      };
    },
  };
}
