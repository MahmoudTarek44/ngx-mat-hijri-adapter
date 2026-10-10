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

  it('lists shipped features, the next adapter, and unscheduled ideas', async () => {
    const harness = await RouterTestingHarness.create('/docs/roadmap');
    const element = harness.routeNativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toBe('Roadmap');
    expect(element.querySelector('#implemented + h2')?.textContent?.trim()).toBe('Implemented');
    expect(element.textContent).toContain('Two calendars, one adapter');
    expect(element.textContent).toContain('CalendarDate');
    expect(element.textContent).toContain('Native Hijri adapter');
    expect(element.textContent).toContain('ngx-mat-hijri-adapter/native');
    expect(element.textContent).toContain('Intl');
    expect(element.textContent).not.toContain('Nothing is in progress.');
    expect(element.querySelectorAll('[data-roadmap-next]').length).toBe(2);
    expect(element.textContent).toContain('Custom calendar-toggle templates');
    expect(element.querySelector('[data-types-decision]')?.textContent).toContain(
      'will not be published',
    );
    expect(element.textContent).toContain('calendarOf()');
    expect(element.textContent).toContain('Package MCP server');
    expect(element.textContent).toContain('Nothing in this list is a commitment');
    expect(element.textContent).not.toContain('Delivery skill');
  });

  it('explains the agent skill for any coding agent', async () => {
    const harness = await RouterTestingHarness.create('/docs/ai-agents');
    const element = harness.routeNativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toBe('AI agents');
    expect(element.querySelector('#agents-md')).not.toBeNull();
    expect(element.querySelector('#cursor')).toBeNull();
    expect(element.textContent).toContain('AGENTS.md');
    expect(element.textContent).toContain('node_modules/ngx-mat-hijri-adapter/agents/SKILL.md');
    expect(element.textContent).toContain('whatever editor you use');
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
