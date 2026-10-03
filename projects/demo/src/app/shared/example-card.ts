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
  host: { class: 'example-card surface-card' },
  template: `
    <header>
      <div>
        <h3>{{ heading() }}</h3>
        <p>{{ description() }}</p>
      </div>
      <code class="entry-point">{{ entryPoint() }}</code>
    </header>
    <mat-tab-group mat-stretch-tabs="false" animationDuration="0ms" [preserveContent]="true">
      <mat-tab label="Demo">
        <ng-content />
      </mat-tab>
      @for (snippet of snippets(); track snippet.label) {
        <mat-tab [label]="snippet.label">
          <code-block [code]="snippet.code" [language]="snippet.language" />
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
