import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ReactiveFieldsDemo } from '../../examples/reactive-fields-demo/reactive-fields-demo';
import { REACTIVE_SNIPPETS } from '../../examples/snippets';
import { ExampleCard } from '../../shared/example-card';

@Component({
  selector: 'reactive-fields',
  imports: [RouterLink, ExampleCard, ReactiveFieldsDemo, TranslatePipe],
  templateUrl: './reactive-fields.html',
})
export class ReactiveFields {
  protected readonly snippets = REACTIVE_SNIPPETS;
}
