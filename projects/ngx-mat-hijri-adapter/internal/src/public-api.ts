/*
 * Shared by ngx-mat-hijri-adapter/reactive and ngx-mat-hijri-adapter/signals.
 * Not part of the public API. Exports may change in any release.
 */

export { provideFieldDateFormats as ɵprovideFieldDateFormats } from './field-providers';
export {
  type CalendarToggleController as ɵCalendarToggleController,
  DateFieldCore as ɵDateFieldCore,
} from './date-field-core';
export {
  type CalendarDateRange as ɵCalendarDateRange,
  type DateFieldLabels as ɵDateFieldLabels,
  type DateFieldPeriod as ɵDateFieldPeriod,
  readCalendarDate as ɵreadCalendarDate,
  equivalentText as ɵequivalentText,
  fieldErrorText as ɵfieldErrorText,
  convertOrNull as ɵconvertOrNull,
  sameValue as ɵsameValue,
} from './field-support';
