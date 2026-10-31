import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../app.routes';
import { DocsTitleStrategy } from '../i18n/docs-title-strategy';
import { provideDocsI18nTesting } from '../i18n/provide-docs-i18n-testing';
import { DOC_PAGES } from './doc-pages';

describe('Docs SEO', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        ...provideDocsI18nTesting(),
        { provide: TitleStrategy, useClass: DocsTitleStrategy },
      ],
    });
  });

  it('sets an English title, description, and canonical URL for each route', async () => {
    const harness = await RouterTestingHarness.create('/');
    const document = TestBed.inject(DOCUMENT);

    expect(document.title).toBe('Hijri and Gregorian dates for Angular Material');
    expect(meta(document, 'description')).toBe(
      'Hijri and Gregorian dates for Angular Material. A Hijri datepicker and date adapter for Angular Material, with form fields for the Umm al-Qura and Gregorian calendars.',
    );
    expect(metaProperty(document, 'og:title')).toBe(document.title);
    expect(metaProperty(document, 'og:description')).toBe(meta(document, 'description'));
    expect(metaProperty(document, 'og:type')).toBe('website');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://ngx-mat-hijri-adapter.dev/',
    );

    for (const page of DOC_PAGES) {
      await harness.navigateByUrl(`/docs/${page.path}`);
      expect(document.title).toContain(page.title);
      expect(document.title).toContain('ngx-mat-hijri-adapter');
      const description = meta(document, 'description');
      expect(description.length).toBeGreaterThan(40);
      expect(description.startsWith('description.')).toBe(false);
      expect(metaProperty(document, 'og:title')).toBe(document.title);
      expect(metaProperty(document, 'og:description')).toBe(description);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
        `https://ngx-mat-hijri-adapter.dev/docs/${page.path}/`,
      );
    }
  });
});

describe('Page not found', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        ...provideDocsI18nTesting(),
        { provide: TitleStrategy, useClass: DocsTitleStrategy },
      ],
    });
  });

  it('shows a noindex page without a canonical URL, and restores both on a docs page', async () => {
    const harness = await RouterTestingHarness.create('/docs/missing');
    const document = TestBed.inject(DOCUMENT);

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe(
      'Page not found',
    );
    expect(harness.routeNativeElement?.querySelector('a[href="/docs"]')).not.toBeNull();
    expect(document.title).toBe('Page not found · ngx-mat-hijri-adapter');
    expect(meta(document, 'robots')).toBe('noindex');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(metaProperty(document, 'og:url')).toBe('');

    await harness.navigateByUrl('/docs/getting-started');

    expect(document.querySelector('meta[name="robots"]')).toBeNull();
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://ngx-mat-hijri-adapter.dev/docs/getting-started/',
    );
  });
});

function meta(document: Document, name: string): string {
  return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? '';
}

function metaProperty(document: Document, property: string): string {
  return document.querySelector(`meta[property="${property}"]`)?.getAttribute('content') ?? '';
}
