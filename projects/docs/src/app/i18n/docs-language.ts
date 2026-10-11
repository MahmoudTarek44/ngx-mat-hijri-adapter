import { DOCUMENT, Service, effect, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type DocsLang = 'en' | 'ar';

const STORAGE_KEY = 'ngx-mat-hijri-adapter-lang';
const LANGS: readonly DocsLang[] = ['en', 'ar'];

/** English or Arabic for the docs site, remembered on this browser. */
@Service()
export class DocsLanguage {
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly storage = this.document.defaultView?.localStorage;

  readonly lang = signal<DocsLang>(this.stored());

  constructor() {
    this.translate.addLangs([...LANGS]);
    effect(() => {
      const lang = this.lang();
      this.translate.use(lang);
      const root = this.document.documentElement;
      root.lang = lang;
      root.dir = lang === 'ar' ? 'rtl' : 'ltr';
      this.storage?.setItem(STORAGE_KEY, lang);
    });
  }

  private stored(): DocsLang {
    const value = this.storage?.getItem(STORAGE_KEY);
    return LANGS.find((lang) => lang === value) ?? 'en';
  }
}
