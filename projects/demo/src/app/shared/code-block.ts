import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'code-block',
  imports: [CdkCopyToClipboard, MatIconButton, MatIcon, MatTooltip],
  template: `
    <div class="code-block">
      <div class="code-head">
        <span>{{ language() }}</span>
        <button
          type="button"
          mat-icon-button
          matTooltip="Copy"
          [attr.aria-label]="'Copy ' + language() + ' code'"
          [cdkCopyToClipboard]="code()"
          (cdkCopyToClipboardCopied)="onCopied($event)"
        >
          <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
        </button>
      </div>
      <pre><code>{{ code() }}</code></pre>
      <span class="cdk-visually-hidden" aria-live="polite">{{ copied() ? 'Copied' : '' }}</span>
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
