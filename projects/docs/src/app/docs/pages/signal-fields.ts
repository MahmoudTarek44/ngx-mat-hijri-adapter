import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SignalFieldsDemo } from '../../examples/signal-fields-demo/signal-fields-demo';
import { SIGNAL_SNIPPETS } from '../../examples/snippets';
import { ExampleCard } from '../../shared/example-card';

@Component({
  selector: 'signal-fields',
  imports: [RouterLink, ExampleCard, SignalFieldsDemo],
  templateUrl: './signal-fields.html',
})
export class SignalFields {
  protected readonly snippets = SIGNAL_SNIPPETS;
}
