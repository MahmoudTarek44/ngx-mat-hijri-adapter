import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { NGX_MAT_HIJRI_ADAPTER_VERSION } from 'ngx-mat-hijri-adapter';

import { GregorianDemo, UmalquraDemo } from '../examples/calendar-demo/calendar-demo';
import { ReactiveFieldsDemo } from '../examples/reactive-fields-demo/reactive-fields-demo';
import { SignalFieldsDemo } from '../examples/signal-fields-demo/signal-fields-demo';
import {
  GREGORIAN_SNIPPETS,
  INSTALL_COMMAND,
  REACTIVE_SNIPPETS,
  SIGNAL_SNIPPETS,
  UMALQURA_SNIPPETS,
} from '../examples/snippets';
import { REPOSITORY_URL } from '../links';
import { CodeBlock } from '../shared/code-block';
import { ExampleCard } from '../shared/example-card';
import { HeroCalendar } from './hero-calendar';
import { Playground } from './playground/playground';

const FEATURES = [
  {
    icon: 'calendar_month',
    title: 'Two calendars, one adapter',
    text: 'HijriDateAdapter runs in Umm al-Qura or Gregorian and switches at runtime with setCalendar().',
  },
  {
    icon: 'translate',
    title: 'Locale is not the calendar',
    text: 'An English Hijri picker or an Arabic Gregorian one. Locale sets digits, names, and week start only.',
  },
  {
    icon: 'dynamic_form',
    title: 'Reactive and signal forms',
    text: 'Ready-made date and range fields: ControlValueAccessor in /reactive, FormValueControl in /signals.',
  },
  {
    icon: 'swap_horiz',
    title: 'Calendar toggle',
    text: 'Users flip the displayed calendar while the form value stays in the calendar you chose.',
  },
  {
    icon: 'format_textdirection_r_to_l',
    title: 'Right-to-left ready',
    text: 'Works with the CDK Dir directive, including the datepicker popup rendered in an overlay.',
  },
  {
    icon: 'rule',
    title: 'Strict parsing',
    text: 'No Date.parse. Typed text is read in the adapter calendar, with Arabic-Indic and Persian digits.',
  },
] as const;

@Component({
  selector: 'home',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    CodeBlock,
    ExampleCard,
    HeroCalendar,
    Playground,
    UmalquraDemo,
    GregorianDemo,
    ReactiveFieldsDemo,
    SignalFieldsDemo,
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  templateUrl: './home.html',
})
export class Home {
  protected readonly version = NGX_MAT_HIJRI_ADAPTER_VERSION;
  protected readonly repositoryUrl = REPOSITORY_URL;
  protected readonly installCommand = INSTALL_COMMAND;
  protected readonly features = FEATURES;
  protected readonly snippets = {
    umalqura: UMALQURA_SNIPPETS,
    gregorian: GREGORIAN_SNIPPETS,
    reactive: REACTIVE_SNIPPETS,
    signals: SIGNAL_SNIPPETS,
  };
}
