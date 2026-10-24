import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TitleStrategy, type RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

const SITE = 'https://ngx-mat-hijri-adapter.dev';

/** Route titles and descriptions, refreshed when the language changes. */
@Injectable()
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private last: RouterStateSnapshot | null = null;

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => {
      if (this.last) {
        this.apply(this.last);
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.last = snapshot;
    this.apply(snapshot);
  }

  private apply(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    if (!key) {
      return;
    }
    const pageTitle = this.translate.instant(key);
    const description = this.translate.instant(key.replace(/^title\./, 'description.'));
    const canonical = canonicalUrl(snapshot.url);
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.setCanonical(canonical);
  }

  private setCanonical(href: string): void {
    const head = this.document.head;
    if (!head) {
      return;
    }
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}

function canonicalUrl(url: string): string {
  const path = url.split(/[?#]/)[0] || '/';
  return path === '/' ? `${SITE}/` : `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
}
