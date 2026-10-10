import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from '../app.routes';
import { DOC_PAGES } from './doc-pages';

describe('Docs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('opens Getting started from /docs with the side navigation and pager', async () => {
    const harness = await RouterTestingHarness.create('/docs');
    const element = harness.routeNativeElement as HTMLElement;

    expect(TestBed.inject(Router).url).toBe('/docs/getting-started');
    expect(element.querySelectorAll('[data-docs-nav] a').length).toBe(DOC_PAGES.length);
    expect(
      element.querySelector('[data-docs-nav] a[aria-current="page"]')?.textContent?.trim(),
    ).toBe('Getting started');
    expect(element.querySelector('h1')?.textContent).toBe('Getting started');
    expect(element.querySelector('[data-pager="previous"]')).toBeNull();
    expect(element.querySelector('[data-pager="next"]')?.textContent).toContain('Calendar values');
    const guides = Array.from(element.querySelectorAll('[aria-label="Form guides"] a')).map(
      (link) => link.getAttribute('href'),
    );
    expect(guides).toEqual(['/docs/reactive-fields', '/docs/signal-fields']);
    expect(element.textContent).toContain('ng add ngx-mat-hijri-adapter');
    expect(element.textContent).toContain(
      'npm install ngx-mat-hijri-adapter @internationalized/date',
    );
    expect(element.textContent).not.toContain('ngx-mat-reactive-date-field');
  });

  it('renders every page', async () => {
    const harness = await RouterTestingHarness.create();

    for (const page of DOC_PAGES) {
      await harness.navigateByUrl(`/docs/${page.path}`);
      const element = harness.routeNativeElement as HTMLElement;
      expect(element.querySelector('h1')?.textContent).toBe(page.title);
    }
  });
});
