import { DOCUMENT, Service, effect, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type DocsLang = 'en' | 'ar';

const STORAGE_KEY = 'ngx-mat-hijri-adapter-lang';
const ARABIC_FONT_ID = 'docs-arabic-font';
const ARABIC_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap';
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
      this.syncArabicFont(lang);
      this.storage?.setItem(STORAGE_KEY, lang);
    });
  }

  private stored(): DocsLang {
    const value = this.storage?.getItem(STORAGE_KEY);
    return LANGS.find((lang) => lang === value) ?? 'en';
  }

  /** Noto Kufi is only needed after the visitor chooses Arabic. */
  private syncArabicFont(lang: DocsLang): void {
    const head = this.document.head;
    if (!head) {
      return;
    }
    const existing = head.querySelector(`#${ARABIC_FONT_ID}`);
    if (lang !== 'ar') {
      existing?.remove();
      return;
    }
    if (existing) {
      return;
    }
    const link = this.document.createElement('link');
    link.id = ARABIC_FONT_ID;
    link.rel = 'stylesheet';
    link.href = ARABIC_FONT_HREF;
    head.appendChild(link);
  }
}
