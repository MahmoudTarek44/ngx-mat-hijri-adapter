import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { NGX_MAT_HIJRI_ADAPTER_VERSION } from 'ngx-mat-hijri-adapter';

import { GregorianDemo, UmalquraDemo } from '../examples/calendar-demo/calendar-demo';
import {
  NativeGregorianDemo,
  NativeUmalquraDemo,
} from '../examples/native-demo/native-demo';
import { ReactiveFieldsDemo } from '../examples/reactive-fields-demo/reactive-fields-demo';
import { SignalFieldsDemo } from '../examples/signal-fields-demo/signal-fields-demo';
import {
  GREGORIAN_SNIPPETS,
  INSTALL_COMMAND,
  MANUAL_INSTALL_COMMAND,
  NATIVE_GREGORIAN_SNIPPETS,
  NATIVE_UMALQURA_SNIPPETS,
  REACTIVE_SNIPPETS,
  SIGNAL_SNIPPETS,
  UMALQURA_SNIPPETS,
} from '../examples/snippets';
import { REPOSITORY_URL } from '../links';
import { CodeBlock } from '../shared/code-block';
import { ExampleCard } from '../shared/example-card';
import { FormGuides } from '../shared/form-guides';
import { Logo } from '../shared/logo';
import { HeroCalendar } from './hero-calendar';
import { Playground } from './playground/playground';

const FEATURES = [
  { icon: 'calendar_month', key: 'twoCalendars' },
  { icon: 'translate', key: 'locale' },
  { icon: 'dynamic_form', key: 'forms' },
  { icon: 'swap_horiz', key: 'toggle' },
  { icon: 'format_textdirection_r_to_l', key: 'rtl' },
  { icon: 'rule', key: 'parsing' },
] as const;

@Component({
  selector: 'home',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    CodeBlock,
    ExampleCard,
    FormGuides,
    HeroCalendar,
    Logo,
    Playground,
    UmalquraDemo,
    GregorianDemo,
    NativeUmalquraDemo,
    NativeGregorianDemo,
    ReactiveFieldsDemo,
    SignalFieldsDemo,
    TranslatePipe,
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  templateUrl: './home.html',
})
export class Home {
  protected readonly version = NGX_MAT_HIJRI_ADAPTER_VERSION;
  protected readonly repositoryUrl = REPOSITORY_URL;
  protected readonly installCommand = INSTALL_COMMAND;
  protected readonly manualInstallCommand = MANUAL_INSTALL_COMMAND;
  protected readonly features = FEATURES;
  protected readonly snippets = {
    umalqura: UMALQURA_SNIPPETS,
    gregorian: GREGORIAN_SNIPPETS,
    nativeUmalqura: NATIVE_UMALQURA_SNIPPETS,
    nativeGregorian: NATIVE_GREGORIAN_SNIPPETS,
    reactive: REACTIVE_SNIPPETS,
    signals: SIGNAL_SNIPPETS,
  };
}
