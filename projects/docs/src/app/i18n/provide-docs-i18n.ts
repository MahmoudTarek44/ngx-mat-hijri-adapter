import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  inject,
  provideAppInitializer,
  type EnvironmentProviders,
  type Provider,
} from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { DocsLanguage } from './docs-language';
import { DocsTitleStrategy } from './docs-title-strategy';

/** ngx-translate over HTTP, with the document language applied before first paint. */
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
      fallbackLang: 'en',
      loader: provideTranslateLoader(TranslateHttpLoader),
    }),
    { provide: TitleStrategy, useClass: DocsTitleStrategy },
    provideAppInitializer(() => {
      const language = inject(DocsLanguage);
      return firstValueFrom(inject(TranslateService).use(language.lang()));
    }),
  ];
}
