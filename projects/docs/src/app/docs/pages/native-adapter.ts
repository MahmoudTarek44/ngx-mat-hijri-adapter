import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import {
  NativeGregorianDemo,
  NativeUmalquraDemo,
} from '../../examples/native-demo/native-demo';
import { NATIVE_GREGORIAN_SNIPPETS, NATIVE_UMALQURA_SNIPPETS } from '../../examples/snippets';
import { ExampleCard } from '../../shared/example-card';

@Component({
  selector: 'native-adapter-page',
  imports: [MatIcon, RouterLink, ExampleCard, NativeUmalquraDemo, NativeGregorianDemo, TranslatePipe],
  templateUrl: './native-adapter.html',
})
export class NativeAdapterPage {
  protected readonly code = {
    nativeUmalqura: NATIVE_UMALQURA_SNIPPETS,
    nativeGregorian: NATIVE_GREGORIAN_SNIPPETS,
  };
}
