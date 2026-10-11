import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gotchas',
  imports: [TranslatePipe],
  templateUrl: './gotchas.html',
})
export class Gotchas {}
