import { Component } from '@angular/core';

import { CodeBlock } from '../../shared/code-block';

const FORMAT = `import { createCalendarDate, formatCalendarDate } from 'ngx-mat-hijri-adapter';

formatCalendarDate(createCalendarDate('islamic-umalqura', 1445, 9, 1), 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}); // '1 Ramadan, 1445'`;

@Component({
  selector: 'parsing-formatting',
  imports: [CodeBlock],
  templateUrl: './parsing-formatting.html',
})
export class ParsingFormatting {
  protected readonly code = { format: FORMAT };
}
