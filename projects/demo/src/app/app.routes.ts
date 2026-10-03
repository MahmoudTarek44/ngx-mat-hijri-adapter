import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'ngx-mat-hijri-adapter: Hijri and Gregorian dates for Angular Material',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  { path: '**', redirectTo: '' },
];
