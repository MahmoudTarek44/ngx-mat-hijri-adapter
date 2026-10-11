import { Component } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import { CodeBlock } from '../../shared/code-block';

const DIR_TS = `import { Dir } from '@angular/cdk/bidi';

@Component({
  imports: [Dir, ReactiveDateField],
  templateUrl: './booking.html',
})
export class Booking {}`;

const DIR_HTML = `<section dir="rtl">
  <ngx-mat-reactive-date-field formControlName="appointment" label="تاريخ الموعد" />
</section>`;

@Component({
  selector: 'right-to-left',
  imports: [CodeBlock, TranslatePipe],
  templateUrl: './right-to-left.html',
})
export class RightToLeft {
  protected readonly code = { ts: DIR_TS, html: DIR_HTML };
}
