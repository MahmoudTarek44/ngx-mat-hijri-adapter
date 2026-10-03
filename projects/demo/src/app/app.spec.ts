import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';
import { Theme } from './theme/theme';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('shows the package version and the main navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-version]')?.textContent?.trim()).toBe('0.1.0');
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
});
