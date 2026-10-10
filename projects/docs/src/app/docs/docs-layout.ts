import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { DOC_PAGES, type DocPage } from './doc-pages';

@Component({
  selector: 'docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButton, MatIcon],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  host: {
    class:
      'mx-auto grid w-full max-w-page grid-cols-1 gap-x-12 gap-y-4 px-6 pt-10 lg:grid-cols-[15rem_minmax(0,1fr)]',
  },
  template: `
    <button
      type="button"
      mat-stroked-button
      class="justify-self-start lg:hidden!"
      aria-controls="docs-nav"
      [attr.aria-expanded]="menuOpen()"
      (click)="menuOpen.set(!menuOpen())"
    >
      <mat-icon>menu_book</mat-icon>
      {{ current()?.title ?? 'Documentation' }}
    </button>

    <nav
      id="docs-nav"
      class="hidden flex-col gap-0.5 self-start data-open:flex data-open:rounded-card data-open:border data-open:bg-surface-container-low data-open:p-4 lg:sticky lg:top-24 lg:flex lg:data-open:rounded-none lg:data-open:border-0 lg:data-open:bg-transparent lg:data-open:p-0"
      aria-label="Documentation"
      data-docs-nav
      [attr.data-open]="menuOpen() || null"
    >
      <p class="mb-3 text-label-large tracking-[0.08em] text-primary uppercase">Documentation</p>
      @for (page of pages; track page.path) {
        <a
          class="rounded-full px-3.5 py-2 text-label-large text-on-surface-variant no-underline hover:bg-surface-container-high hover:text-on-surface"
          [routerLink]="['/docs', page.path]"
          routerLinkActive="bg-secondary-container! text-on-secondary-container!"
          ariaCurrentWhenActive="page"
          (click)="menuOpen.set(false)"
          >{{ page.title }}</a
        >
      }
    </nav>

    <div class="max-w-208 min-w-0">
      <router-outlet />

      <nav class="mt-12 flex justify-between gap-4" aria-label="Previous and next page">
        @if (previous(); as page) {
          <a
            class="grid min-w-0 flex-1 gap-0.5 sm:min-w-48 sm:flex-none rounded-2xl border px-5 py-4 text-title-small text-on-surface no-underline hover:border-primary"
            data-pager="previous"
            [routerLink]="['/docs', page.path]"
          >
            <span class="text-label-medium text-on-surface-variant">Previous</span>
            {{ page.title }}
          </a>
        }
        @if (next(); as page) {
          <a
            class="ms-auto grid min-w-0 flex-1 gap-0.5 sm:min-w-48 sm:flex-none rounded-2xl border px-5 py-4 text-end text-title-small text-on-surface no-underline hover:border-primary"
            data-pager="next"
            [routerLink]="['/docs', page.path]"
          >
            <span class="text-label-medium text-on-surface-variant">Next</span>
            {{ page.title }}
          </a>
        }
      </nav>
    </div>
  `,
})
export class DocsLayout {
  private readonly router = inject(Router);

  protected readonly pages = DOC_PAGES;
  protected readonly menuOpen = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  private readonly index = computed(() => {
    const path = this.url().split(/[?#]/)[0].split('/').pop();
    return DOC_PAGES.findIndex((page) => page.path === path);
  });
  protected readonly current = computed<DocPage | undefined>(() => DOC_PAGES[this.index()]);
  protected readonly previous = computed(() =>
    this.index() > 0 ? DOC_PAGES[this.index() - 1] : undefined,
  );
  protected readonly next = computed(() =>
    this.index() >= 0 && this.index() < DOC_PAGES.length - 1
      ? DOC_PAGES[this.index() + 1]
      : undefined,
  );
}
