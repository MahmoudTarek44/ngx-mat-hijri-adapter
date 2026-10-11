import { Component } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import { FormGuides } from '../../shared/form-guides';

@Component({
  selector: 'form-fields',
  imports: [FormGuides, TranslatePipe],
  templateUrl: './form-fields.html',
})
export class FormFields {}
