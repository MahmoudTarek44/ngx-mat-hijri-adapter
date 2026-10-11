import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { translate, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'form-guides',
  imports: [RouterLink, TranslatePipe],
  host: {
    class: 'grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4',
    role: 'navigation',
    '[attr.aria-label]': 'guidesLabel()',
  },
  templateUrl: './form-guides.html',
})
export class FormGuides {
  protected readonly guidesLabel = translate('formGuides.aria');
}
