/** Stable calendar identifiers. `gregorian` maps to the Intl calendar `gregory`. */
export const CalendarCode = {
  gregorian: 'gregorian',
  umalqura: 'islamic-umalqura',
} as const;

/** A calendar this package can select at runtime. */
export type SupportedCalendar = (typeof CalendarCode)[keyof typeof CalendarCode];

/** First Hijri year in the Umm al-Qura range, inclusive. */
export const UMALQURA_MIN_YEAR = 1300;

/** Last Hijri year in the Umm al-Qura range, inclusive. */
export const UMALQURA_MAX_YEAR = 1599;

/** Thrown when a Umm al-Qura year is outside {@link UMALQURA_MIN_YEAR}–{@link UMALQURA_MAX_YEAR}. */
export class UmalquraDateRangeError extends Error {
  constructor(year: number) {
    super(
      `Hijri year ${year} is outside the Umm al-Qura table (${UMALQURA_MIN_YEAR}–${UMALQURA_MAX_YEAR}).`,
    );
    this.name = 'UmalquraDateRangeError';
  }
}
