import { Component } from '@angular/core';

import { CodeBlock } from '../../shared/code-block';

const CREATE = `import { CalendarCode, convertCalendarDate, createCalendarDate } from 'ngx-mat-hijri-adapter';

const hijri = createCalendarDate(CalendarCode.umalqura, 1445, 9, 1); // 1 Ramadan 1445
const gregorian = convertCalendarDate(hijri, CalendarCode.gregorian); // 11 March 2024`;

const CONSTANTS = `import { CalendarCode, CalendarLocale, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

CalendarCode.gregorian; // 'gregorian'
CalendarCode.umalqura; // 'islamic-umalqura'
CalendarLocale.arSA; // 'ar-SA'
CalendarLocale.enUS; // 'en-US'

provideHijriDateAdapter({ calendar: CalendarCode.gregorian, locale: CalendarLocale.enUS });`;

@Component({
  selector: 'calendar-values',
  imports: [CodeBlock],
  templateUrl: './calendar-values.html',
})
export class CalendarValues {
  protected readonly code = { create: CREATE, constants: CONSTANTS };
}
