import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'form-guides',
  imports: [RouterLink],
  host: {
    class: 'grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4',
    'aria-label': 'Form guides',
    role: 'navigation',
  },
  templateUrl: './form-guides.html',
})
export class FormGuides {}
