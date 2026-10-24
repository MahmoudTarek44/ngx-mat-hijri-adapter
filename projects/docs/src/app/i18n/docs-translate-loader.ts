import { TranslateLoader, type TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import ar from '../../locale/ar.json';
import en from '../../locale/en.json';

const dictionaries: Record<string, TranslationObject> = {
  en: en as TranslationObject,
  ar: ar as TranslationObject,
};

/** Synchronous loader for unit tests. The app bundles English and fetches Arabic. */
export class DocsTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(dictionaries[lang] ?? dictionaries['en']);
  }
}
