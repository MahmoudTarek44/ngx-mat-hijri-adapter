import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

/** Shown for any address that is not a docs page. GitHub Pages serves it as 404.html. */
@Component({
  selector: 'not-found',
  imports: [MatButton, RouterLink, TranslatePipe],
  template: `
    <section class="mx-auto flex w-full max-w-page flex-col items-start gap-4 px-6 py-24">
      <p class="font-mono text-label-large tracking-[0.08em] text-primary">404</p>

      <h1 class="text-display-small font-extrabold tracking-[-0.02em]">
        {{ 'notFound.heading' | translate }}
      </h1>

      <p class="max-w-152 text-on-surface-variant">{{ 'notFound.body' | translate }}</p>

      <div class="mt-2 flex flex-wrap gap-3">
        <a matButton="filled" routerLink="/">{{ 'notFound.home' | translate }}</a>
        <a matButton="outlined" routerLink="/docs">{{ 'notFound.docs' | translate }}</a>
      </div>
    </section>
  `,
})
export class NotFound {}
