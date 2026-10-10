import { Component, input } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { CodeBlock } from './code-block';

export interface Snippet {
  label: string;
  language: string;
  code: string;
}

@Component({
  selector: 'example-card',
  imports: [MatTabGroup, MatTab, CodeBlock],
  host: {
    class: 'flex min-w-0 flex-col overflow-hidden rounded-card border bg-surface-container-low',
  },
  template: `
    <header class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-6 pt-5 pb-2">
      <div>
        <h3 class="mb-1 text-title-large font-semibold">{{ heading() }}</h3>
        <p class="text-body-medium text-on-surface-variant">{{ description() }}</p>
      </div>
      <code class="text-primary">{{ entryPoint() }}</code>
    </header>
    <mat-tab-group mat-stretch-tabs="false" animationDuration="0ms" [preserveContent]="true">
      <mat-tab label="Demo">
        <ng-content />
      </mat-tab>
      @for (snippet of snippets(); track snippet.label) {
        <mat-tab [label]="snippet.label">
          <code-block class="mx-6 mt-4 mb-6" [code]="snippet.code" [language]="snippet.language" />
        </mat-tab>
      }
    </mat-tab-group>
  `,
})
export class ExampleCard {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly entryPoint = input.required<string>();
  readonly snippets = input.required<readonly Snippet[]>();
}
