import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'ngx-mat-hijri-adapter: Hijri and Gregorian dates for Angular Material',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs-layout').then((m) => m.DocsLayout),
    loadChildren: () => import('./docs/doc-pages').then((m) => m.DOC_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
