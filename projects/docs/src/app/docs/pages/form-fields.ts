import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { FormGuides } from '../../shared/form-guides';

@Component({
  selector: 'form-fields',
  imports: [FormGuides, RouterLink, TranslatePipe],
  templateUrl: './form-fields.html',
})
export class FormFields {}
