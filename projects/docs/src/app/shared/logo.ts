import { Component } from '@angular/core';

/** The package logo in the theme colors. Size it with a class on the host. */
@Component({
  selector: 'package-logo',
  host: { class: 'block shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg class="size-full" viewBox="0 0 250 250">
      <path class="fill-primary" d="M125 30 31.9 63.2l14.2 123.1L125 230Z" />
      <path class="fill-[light-dark(#005225,#00a751)]" d="m125 30 93.1 33.2-14.2 123.1L125 230Z" />
      <rect class="fill-on-primary" x="70" y="84" width="110" height="100" rx="14" />
      <rect class="fill-primary" x="70" y="108" width="55" height="8" />
      <rect class="fill-[light-dark(#005225,#00a751)]" x="125" y="108" width="55" height="8" />
      <rect
        class="fill-on-primary stroke-primary"
        x="92"
        y="66"
        width="14"
        height="32"
        rx="7"
        stroke-width="5"
      />
      <rect
        class="fill-on-primary stroke-[light-dark(#005225,#00a751)]"
        x="144"
        y="66"
        width="14"
        height="32"
        rx="7"
        stroke-width="5"
      />
      <circle class="fill-tertiary" cx="122" cy="150" r="24" />
      <circle class="fill-on-primary" cx="133" cy="143" r="20" />
      <path
        class="fill-tertiary"
        d="m148 129 2.2 6.8 6.8 2.2-6.8 2.2-2.2 6.8-2.2-6.8-6.8-2.2 6.8-2.2Z"
      />
    </svg>
  `,
})
export class Logo {}
