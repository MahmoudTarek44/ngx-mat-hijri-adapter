import { type Provider } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  type MatDateFormats,
} from '@angular/material/core';

import { CalendarCode } from '../calendar/supported-calendars';
import { HIJRI_DATE_FORMATS } from '../formats/date-formats';
import { CalendarLocale } from '../locale/calendar-locale';
import { HijriDateAdapter } from './hijri-date-adapter';
import {
  HIJRI_DATE_ADAPTER_OPTIONS,
  type HijriDateAdapterOptions,
} from './hijri-date-adapter-options';

/** Options for {@link provideHijriDateAdapter}. Locale does not select the calendar. */
export interface ProvideHijriDateAdapterOptions extends HijriDateAdapterOptions {
  /** Material format slots. Defaults to {@link HIJRI_DATE_FORMATS}. */
  formats?: MatDateFormats;
}

/**
 * Registers `HijriDateAdapter`, `MAT_DATE_FORMATS`, and `MAT_DATE_LOCALE`.
 * Defaults are the Umm al-Qura calendar and the `ar-SA` locale.
 */
export function provideHijriDateAdapter(options: ProvideHijriDateAdapterOptions = {}): Provider[] {
  const calendar = options.calendar ?? CalendarCode.umalqura;
  const locale = options.locale ?? CalendarLocale.arSA;
  const adapterOptions: HijriDateAdapterOptions = { calendar, locale };

  if (options.timeZone !== undefined) {
    adapterOptions.timeZone = options.timeZone;
  }

  return [
    { provide: DateAdapter, useClass: HijriDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: options.formats ?? HIJRI_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: locale },
    { provide: HIJRI_DATE_ADAPTER_OPTIONS, useValue: adapterOptions },
  ];
}
