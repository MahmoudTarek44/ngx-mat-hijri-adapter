import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';
import { DocsLanguage } from './i18n/docs-language';
import { provideDocsI18nTesting } from './i18n/provide-docs-i18n-testing';
import { Theme } from './theme/theme';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), ...provideDocsI18nTesting()],
    }).compileComponents();
  });

  it('shows the package version and the main navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-version]')?.textContent?.trim()).toBe('0.4.2');
    const banner = compiled.querySelector('[data-release-banner]');
    const notice = banner?.textContent?.replace(/\s+/g, ' ') ?? '';
    expect(notice).toContain('0.4.2 is tagged on GitHub and is not published on npm');
    expect(notice).toContain('A beta will be published before the stable 1.0.0.');
    expect(banner?.querySelector('a')?.getAttribute('href')).toBe(
      'https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.4.2',
    );
    const links = Array.from(compiled.querySelectorAll('nav a')).map((a) => a.textContent?.trim());
    expect(links).toEqual(['Docs', 'Playground', 'Examples']);
  });

  it('applies and remembers the chosen theme', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const theme = TestBed.inject(Theme);
    const root = TestBed.inject(DOCUMENT).documentElement;

    theme.mode.set('dark');
    TestBed.tick();
    expect(root.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ngx-mat-hijri-adapter-theme')).toBe('dark');

    theme.mode.set('system');
    TestBed.tick();
    expect(root.classList.contains('dark')).toBe(false);
    expect(root.classList.contains('light')).toBe(false);
  });

  it('keeps the prerender defaults until hydration, then restores the saved choice', async () => {
    localStorage.setItem('ngx-mat-hijri-adapter-lang', 'ar');
    localStorage.setItem('ngx-mat-hijri-adapter-theme', 'dark');
    const fixture = TestBed.createComponent(App);
    const language = TestBed.inject(DocsLanguage);
    const theme = TestBed.inject(Theme);
    const root = TestBed.inject(DOCUMENT).documentElement;

    expect(language.lang()).toBe('en');
    expect(theme.mode()).toBe('system');
    expect(root.lang).toBe('en');
    expect(root.dir).toBe('ltr');
    expect(root.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('ngx-mat-hijri-adapter-lang')).toBe('ar');
    expect(localStorage.getItem('ngx-mat-hijri-adapter-theme')).toBe('dark');

    await fixture.whenStable();

    expect(language.lang()).toBe('ar');
    expect(theme.mode()).toBe('dark');
    expect(root.lang).toBe('ar');
    expect(root.dir).toBe('rtl');
    expect(root.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ngx-mat-hijri-adapter-lang')).toBe('ar');
    expect(localStorage.getItem('ngx-mat-hijri-adapter-theme')).toBe('dark');
  });

  it('switches the document to Arabic and remembers it', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const language = TestBed.inject(DocsLanguage);
    const root = TestBed.inject(DOCUMENT).documentElement;

    expect(root.ownerDocument.getElementById('docs-arabic-font')).toBeNull();

    language.lang.set('ar');
    await fixture.whenStable();

    expect(root.ownerDocument.getElementById('docs-arabic-font')?.getAttribute('href')).toContain(
      'Noto+Kufi+Arabic',
    );
    expect(root.lang).toBe('ar');
    expect(root.dir).toBe('rtl');
    expect(localStorage.getItem('ngx-mat-hijri-adapter-lang')).toBe('ar');
    const links = Array.from(fixture.nativeElement.querySelectorAll('header nav a')).map((link) =>
      (link as HTMLElement).textContent?.trim(),
    );
    expect(links).toEqual(['التوثيق', 'التجربة', 'الأمثلة']);
  });
});
