import type { Route, Routes } from '@angular/router';

const notFound: Route = {
  title: 'title.not-found',
  data: { noindex: true },
  loadComponent: () => import('./not-found').then((m) => m.NotFound),
};

export const routes: Routes = [
  {
    path: '',
    title: 'title.home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs-layout').then((m) => m.DocsLayout),
    loadChildren: () => import('./docs/doc-pages').then((m) => m.DOC_ROUTES),
  },
  // Prerendered to 404/index.html, which the Pages workflow moves to 404.html.
  { path: '404', ...notFound },
  { path: '**', ...notFound },
];
