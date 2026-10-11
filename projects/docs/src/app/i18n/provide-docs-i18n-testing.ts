import type { Provider } from '@angular/core';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';

import { DocsTranslateLoader } from './docs-translate-loader';

/** English translations available on the first change detection. */
export function provideDocsI18nTesting(): Provider[] {
  return provideTranslateService({
    fallbackLang: 'en',
    lang: 'en',
    loader: provideTranslateLoader(DocsTranslateLoader),
  });
}
