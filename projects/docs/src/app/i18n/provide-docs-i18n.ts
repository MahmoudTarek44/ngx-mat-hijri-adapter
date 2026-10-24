import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  type EnvironmentProviders,
  type Provider,
} from '@angular/core';
import { TitleStrategy } from '@angular/router';
import {
  provideTranslateLoader,
  provideTranslateService,
  TranslateService,
  type TranslationObject,
} from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import en from '../../locale/en.json';
import { DocsLanguage } from './docs-language';
import { DocsTitleStrategy } from './docs-title-strategy';

/** English is bundled. Arabic is fetched when the visitor switches language. */
export function provideDocsI18n(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useFactory: () => {
        const baseHref = inject(DOCUMENT).querySelector('base')?.getAttribute('href') ?? '/';
        const base = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
        return {
          resources: [{ prefix: `${base}i18n/`, suffix: '.json' }],
          failOnError: true,
        };
      },
    },
    ...provideTranslateService({
      loader: provideTranslateLoader(TranslateHttpLoader),
    }),
    { provide: TitleStrategy, useClass: DocsTitleStrategy },
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.setTranslation('en', en as TranslationObject);
      translate.setFallbackLang('en');
      const language = inject(DocsLanguage);
      return firstValueFrom(translate.use(language.lang()));
    }),
  ];
}
