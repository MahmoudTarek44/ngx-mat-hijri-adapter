import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'code-block',
  imports: [CdkCopyToClipboard, MatIconButton, MatIcon, MatTooltip],
  host: { class: 'block' },
  template: `
    <div class="overflow-hidden rounded-[14px] bg-code text-code-text">
      <div
        class="flex items-center justify-between border-b border-white/8 py-0.5 ps-4 pe-1 font-mono text-label-medium text-code-muted uppercase"
      >
        <span>{{ language() }}</span>
        <button
          type="button"
          class="text-code-action!"
          mat-icon-button
          matTooltip="Copy"
          [attr.aria-label]="'Copy ' + language() + ' code'"
          [cdkCopyToClipboard]="code()"
          (cdkCopyToClipboardCopied)="onCopied($event)"
        >
          <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
        </button>
      </div>
      <pre
        class="overflow-x-auto px-5 pt-4 pb-5 text-left text-[0.85rem] leading-[1.65] [direction:ltr]"
      ><code>{{ code() }}</code></pre>
      <span class="sr-only" aria-live="polite">{{ copied() ? 'Copied' : '' }}</span>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly language = input('ts');

  protected readonly copied = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected onCopied(success: boolean): void {
    if (!success) {
      return;
    }

    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 1600);
  }
}
