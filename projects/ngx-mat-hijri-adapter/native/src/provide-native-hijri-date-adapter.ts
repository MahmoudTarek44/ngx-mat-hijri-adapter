import { type Provider } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  type MatDateFormats,
} from '@angular/material/core';
import { CalendarCode, CalendarLocale, HIJRI_DATE_FORMATS } from 'ngx-mat-hijri-adapter';

import { NativeHijriDateAdapter } from './native-hijri-date-adapter';
import {
  NATIVE_HIJRI_DATE_ADAPTER_OPTIONS,
  type NativeHijriDateAdapterOptions,
} from './native-hijri-date-adapter-options';

/** Options for {@link provideNativeHijriDateAdapter}. Locale does not select the calendar. */
export interface ProvideNativeHijriDateAdapterOptions extends NativeHijriDateAdapterOptions {
  /** Material format slots. Defaults to {@link HIJRI_DATE_FORMATS}. */
  formats?: MatDateFormats;
}

/**
 * Registers `NativeHijriDateAdapter`, `MAT_DATE_FORMATS`, and `MAT_DATE_LOCALE`.
 * The stored value is a JavaScript `Date` at UTC noon.
 * Defaults are the Umm al-Qura calendar and the `ar-SA` locale.
 */
export function provideNativeHijriDateAdapter(
  options: ProvideNativeHijriDateAdapterOptions = {},
): Provider[] {
  const calendar = options.calendar ?? CalendarCode.umalqura;
  const locale = options.locale ?? CalendarLocale.arSA;
  const adapterOptions: NativeHijriDateAdapterOptions = { calendar, locale };

  if (options.timeZone !== undefined) {
    adapterOptions.timeZone = options.timeZone;
  }

  if (options.firstDayOfWeek !== undefined) {
    adapterOptions.firstDayOfWeek = options.firstDayOfWeek;
  }

  return [
    { provide: DateAdapter, useClass: NativeHijriDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: options.formats ?? HIJRI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: locale },
    { provide: NATIVE_HIJRI_DATE_ADAPTER_OPTIONS, useValue: adapterOptions },
  ];
}
