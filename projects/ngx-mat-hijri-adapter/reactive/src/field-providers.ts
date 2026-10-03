import { type Provider, inject } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HIJRI_DATE_FORMATS } from 'ngx-mat-hijri-adapter';

/** Keeps formats registered by the app, and falls back to the package formats. */
export function provideFieldDateFormats(): Provider {
  return {
    provide: MAT_DATE_FORMATS,
    useFactory: () =>
      inject(MAT_DATE_FORMATS, { optional: true, skipSelf: true }) ?? HIJRI_DATE_FORMATS,
  };
}
