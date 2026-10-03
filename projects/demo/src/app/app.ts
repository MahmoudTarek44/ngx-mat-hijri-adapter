import { Component } from '@angular/core';

import { NGX_MAT_HIJRI_ADAPTER_VERSION } from 'ngx-mat-hijri-adapter';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly version = NGX_MAT_HIJRI_ADAPTER_VERSION;
}
