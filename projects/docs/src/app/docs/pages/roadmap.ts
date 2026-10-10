import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface RoadmapFeature {
  title: string;
  detail: string;
}

interface RoadmapIdea {
  title: string;
  detail: string;
}

@Component({
  selector: 'roadmap',
  imports: [RouterLink],
  templateUrl: './roadmap.html',
})
export class Roadmap {
  protected readonly implemented: readonly RoadmapFeature[] = [
    {
      title: 'Two calendars, one adapter',
      detail:
        'HijriDateAdapter runs the Umm al-Qura or Gregorian calendar and can switch at runtime.',
    },
    {
      title: 'Locale is not the calendar',
      detail:
        'An English Hijri picker and an Arabic Gregorian picker both work. Locale sets digits, names, and the week start.',
    },
    {
      title: 'CalendarDate values',
      detail:
        'Stored dates are CalendarDate objects from @internationalized/date, never a JavaScript Date, so a time zone cannot shift the day.',
    },
    {
      title: 'Material datepicker',
      detail: 'A plain mat-datepicker uses the adapter, including min, max, and date filters.',
    },
    {
      title: 'Reactive and signal fields',
      detail: 'Date and range fields for reactive forms and for signal forms.',
    },
    {
      title: 'Calendar toggle',
      detail:
        'The field can show and accept the other calendar while the stored value stays in valueCalendar. An optional hint shows that same day in the other calendar.',
    },
    {
      title: 'Display formats',
      detail: "Numeric day, month, and year, or the locale's month name.",
    },
    {
      title: 'Strict parsing',
      detail:
        'Typed text is read in the active calendar, including Arabic-Indic and Persian digits. Unreadable text becomes an invalid date instead of a guessed one.',
    },
    {
      title: 'Right-to-left',
      detail: 'Works with the CDK direction directive, including the datepicker overlay.',
    },
    {
      title: 'ng add',
      detail:
        'ng add installs the calendar peer when it is missing and registers provideHijriDateAdapter().',
    },
    {
      title: 'Agent skill',
      detail:
        'The package ships a skill that tells a coding agent how to install the adapter and store dates.',
    },
  ];

  protected readonly inDevelopment: readonly RoadmapFeature[] = [
    {
      title: 'Native Hijri adapter',
      detail:
        'A Hijri adapter built on the JavaScript Intl APIs and the Date object, rather than @internationalized/date and CalendarDate.',
    },
  ];

  protected readonly future: readonly RoadmapIdea[] = [
    {
      title: 'calendarOf() helper',
      detail:
        'Application code can ask which supported calendar a CalendarDate uses, without comparing gregory and gregorian by hand.',
    },
    {
      title: 'Persian and Urdu month names',
      detail: 'Hijri month names for Persian and Urdu. The built-in names are Arabic and English only.',
    },
    {
      title: 'Stable 1.0.0 release',
      detail:
        'Version, changelog, tag, and retiring the unpublished-version banner on the docs site.',
    },
    {
      title: 'Changelog page',
      detail: 'A changelog page on the docs site, fed by CHANGELOG.md.',
    },
    {
      title: 'Clearer calendar-toggle buttons',
      detail: 'They open the picker, and the accessible name should say so.',
    },
    {
      title: 'ng update migrations',
      detail: 'Kept current when a future Angular Material DateAdapter change requires one.',
    },
  ];
}
