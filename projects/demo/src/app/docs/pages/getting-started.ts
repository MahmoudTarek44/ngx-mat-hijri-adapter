import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NGX_MAT_HIJRI_ADAPTER_VERSION } from 'ngx-mat-hijri-adapter';

import { INSTALL_COMMAND } from '../../examples/snippets';
import { CodeBlock } from '../../shared/code-block';

const PROVIDER = `import { provideHijriDateAdapter } from 'ngx-mat-hijri-adapter';

bootstrapApplication(App, {
  providers: [provideHijriDateAdapter()],
});`;

const DATEPICKER_TS = `date = new FormControl<CalendarDate | null>(null);`;

const DATEPICKER_HTML = `<mat-form-field>
  <mat-label>Date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="date" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>`;

const FIELD_TS = `import { ReactiveDateField } from 'ngx-mat-hijri-adapter/reactive';`;

const FIELD_HTML = `<ngx-mat-reactive-date-field [formControl]="date" label="Date" calendarToggle />`;

@Component({
  selector: 'getting-started',
  imports: [RouterLink, CodeBlock],
  templateUrl: './getting-started.html',
})
export class GettingStarted {
  protected readonly version = NGX_MAT_HIJRI_ADAPTER_VERSION;
  protected readonly code = {
    install: INSTALL_COMMAND,
    provider: PROVIDER,
    datepickerTs: DATEPICKER_TS,
    datepickerHtml: DATEPICKER_HTML,
    fieldTs: FIELD_TS,
    fieldHtml: FIELD_HTML,
  };
}
