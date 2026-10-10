import type { Routes } from '@angular/router';

export interface DocPage {
  path: string;
  title: string;
}

export const DOC_PAGES: readonly DocPage[] = [
  { path: 'getting-started', title: 'Getting started' },
  { path: 'calendar-values', title: 'Calendar values' },
  { path: 'date-adapter', title: 'Date adapter' },
  { path: 'parsing-formatting', title: 'Parsing and formatting' },
  { path: 'form-fields', title: 'Form fields' },
  { path: 'reactive-fields', title: 'Reactive fields' },
  { path: 'signal-fields', title: 'Signal fields' },
  { path: 'right-to-left', title: 'Right-to-left' },
  { path: 'api', title: 'API reference' },
  { path: 'gotchas', title: 'Gotchas' },
  { path: 'ai-agents', title: 'AI agents' },
];

const pageTitle = (title: string) => `${title} · ngx-mat-hijri-adapter`;

export const DOC_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
  {
    path: 'getting-started',
    title: pageTitle('Getting started'),
    loadComponent: () => import('./pages/getting-started').then((m) => m.GettingStarted),
  },
  {
    path: 'calendar-values',
    title: pageTitle('Calendar values'),
    loadComponent: () => import('./pages/calendar-values').then((m) => m.CalendarValues),
  },
  {
    path: 'date-adapter',
    title: pageTitle('Date adapter'),
    loadComponent: () => import('./pages/date-adapter').then((m) => m.DateAdapterPage),
  },
  {
    path: 'parsing-formatting',
    title: pageTitle('Parsing and formatting'),
    loadComponent: () => import('./pages/parsing-formatting').then((m) => m.ParsingFormatting),
  },
  {
    path: 'form-fields',
    title: pageTitle('Form fields'),
    loadComponent: () => import('./pages/form-fields').then((m) => m.FormFields),
  },
  {
    path: 'reactive-fields',
    title: pageTitle('Reactive fields'),
    loadComponent: () => import('./pages/reactive-fields').then((m) => m.ReactiveFields),
  },
  {
    path: 'signal-fields',
    title: pageTitle('Signal fields'),
    loadComponent: () => import('./pages/signal-fields').then((m) => m.SignalFields),
  },
  {
    path: 'right-to-left',
    title: pageTitle('Right-to-left'),
    loadComponent: () => import('./pages/right-to-left').then((m) => m.RightToLeft),
  },
  {
    path: 'api',
    title: pageTitle('API reference'),
    loadComponent: () => import('./pages/api').then((m) => m.ApiReference),
  },
  {
    path: 'gotchas',
    title: pageTitle('Gotchas'),
    loadComponent: () => import('./pages/gotchas').then((m) => m.Gotchas),
  },
  {
    path: 'ai-agents',
    title: pageTitle('AI agents'),
    loadComponent: () => import('./pages/ai-agents').then((m) => m.AiAgents),
  },
];
