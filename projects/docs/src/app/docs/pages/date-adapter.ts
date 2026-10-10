import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../shared/code-block';

const CONFIG = `import { CalendarCode, CalendarLocale, provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

providers: [
  provideHijriDateAdapter({
    calendar: CalendarCode.gregorian,
    locale: CalendarLocale.enUS,
    timeZone: 'UTC',
  }),
];`;

const SWITCH = `const adapter = inject(DateAdapter) as HijriDateAdapter;

adapter.setCalendar(CalendarCode.gregorian);
adapter.calendar; // 'gregorian'`;

const MONTHS = `adapter.createDate(1445, 8, 1); // 1 Ramadan 1445: Material months are 0-based
adapter.addCalendarMonths(adapter.createDate(1445, 8, 30), 1); // 29 Shawwal 1445`;

@Component({
  selector: 'date-adapter-page',
  imports: [RouterLink, CodeBlock],
  templateUrl: './date-adapter.html',
})
export class DateAdapterPage {
  protected readonly code = { config: CONFIG, switch: SWITCH, months: MONTHS };
}
