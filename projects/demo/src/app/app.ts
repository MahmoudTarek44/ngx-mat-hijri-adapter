import { Component } from '@angular/core';

import {
  convertCalendarDate,
  createCalendarDate,
  NGX_MAT_HIJRI_ADAPTER_VERSION,
} from 'ngx-mat-hijri-adapter';

import { GregorianDemo, UmalquraDemo } from './calendar-demo/calendar-demo';
import { ReactiveFieldsDemo } from './reactive-fields-demo/reactive-fields-demo';

const hijri = createCalendarDate('islamic-umalqura', 1445, 9, 1);
const gregorian = convertCalendarDate(hijri, 'gregorian');

@Component({
  selector: 'app-root',
  imports: [UmalquraDemo, GregorianDemo, ReactiveFieldsDemo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly version = NGX_MAT_HIJRI_ADAPTER_VERSION;
  protected readonly hijriLabel = isoDate(hijri.year, hijri.month, hijri.day);
  protected readonly gregorianLabel = isoDate(gregorian.year, gregorian.month, gregorian.day);
}

function isoDate(year: number, month: number, day: number): string {
  return [year, month, day].map((part) => String(part).padStart(2, '0')).join('-');
}
