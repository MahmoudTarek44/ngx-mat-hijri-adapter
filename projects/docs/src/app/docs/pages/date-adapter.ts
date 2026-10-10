import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  NativeGregorianDemo,
  NativeUmalquraDemo,
} from '../../examples/native-demo/native-demo';
import { NATIVE_GREGORIAN_SNIPPETS, NATIVE_UMALQURA_SNIPPETS } from '../../examples/snippets';
import { CodeBlock } from '../../shared/code-block';
import { ExampleCard } from '../../shared/example-card';

const CONFIG = `import { CalendarCode, CalendarLocale, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

bootstrapApplication(App, {
  providers: [
    provideHijriDateAdapter({
      calendar: CalendarCode.gregorian,
      locale: CalendarLocale.enUS,
      timeZone: 'UTC',
    }),
  ],
});`;

const HIJRI_DATEPICKER = `import type { CalendarDate } from '@internationalized/date';

date = new FormControl<CalendarDate | null>(null);`;

const DATEPICKER_HTML = `<mat-form-field>
  <mat-label>Date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="date" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`;

const SWITCH = `const adapter = inject(DateAdapter) as HijriDateAdapter;

adapter.setCalendar(CalendarCode.gregorian);
adapter.calendar; // 'gregorian'`;

const MONTHS = `adapter.createDate(1445, 8, 1); // 1 Ramadan 1445: Material months are 0-based
adapter.addCalendarMonths(adapter.createDate(1445, 8, 30), 1); // 29 Shawwal 1445`;

@Component({
  selector: 'date-adapter-page',
  imports: [RouterLink, CodeBlock, ExampleCard, NativeUmalquraDemo, NativeGregorianDemo],
  templateUrl: './date-adapter.html',
})
export class DateAdapterPage {
  protected readonly code = {
    config: CONFIG,
    hijriDatepicker: HIJRI_DATEPICKER,
    datepickerHtml: DATEPICKER_HTML,
    nativeUmalqura: NATIVE_UMALQURA_SNIPPETS,
    nativeGregorian: NATIVE_GREGORIAN_SNIPPETS,
    switch: SWITCH,
    months: MONTHS,
  };
}
