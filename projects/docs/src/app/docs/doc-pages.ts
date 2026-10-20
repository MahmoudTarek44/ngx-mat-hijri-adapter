import type { Routes } from '@angular/router';

export interface DocPage {
  path: string;
  title: string;
  icon?: string;
}

export const DOC_PAGES: readonly DocPage[] = [
  { path: 'getting-started', title: 'Getting started' },
  { path: 'calendar-values', title: 'Calendar values' },
  { path: 'date-adapter', title: 'Date adapter' },
  { path: 'native-adapter', title: 'Native adapter' },
  { path: 'parsing-formatting', title: 'Parsing and formatting' },
  { path: 'form-fields', title: 'Form fields' },
  { path: 'reactive-fields', title: 'Reactive fields' },
  { path: 'signal-fields', title: 'Signal fields' },
  { path: 'right-to-left', title: 'Right-to-left' },
  { path: 'api', title: 'API reference' },
  { path: 'gotchas', title: 'Gotchas' },
  { path: 'ai-agents', title: 'AI agents', icon: 'smart_toy' },
  { path: 'roadmap', title: 'Roadmap', icon: 'map' },
];

const pageTitle = (path: string) => `title.${path}`;

export const DOC_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'getting-started' },
  {
    path: 'getting-started',
    title: pageTitle('getting-started'),
    loadComponent: () => import('./pages/getting-started').then((m) => m.GettingStarted),
  },
  {
    path: 'calendar-values',
    title: pageTitle('calendar-values'),
    loadComponent: () => import('./pages/calendar-values').then((m) => m.CalendarValues),
  },
  {
    path: 'date-adapter',
    title: pageTitle('date-adapter'),
    loadComponent: () => import('./pages/date-adapter').then((m) => m.DateAdapterPage),
  },
  {
    path: 'native-adapter',
    title: pageTitle('native-adapter'),
    loadComponent: () => import('./pages/native-adapter').then((m) => m.NativeAdapterPage),
  },
  {
    path: 'parsing-formatting',
    title: pageTitle('parsing-formatting'),
    loadComponent: () => import('./pages/parsing-formatting').then((m) => m.ParsingFormatting),
  },
  {
    path: 'form-fields',
    title: pageTitle('form-fields'),
    loadComponent: () => import('./pages/form-fields').then((m) => m.FormFields),
  },
  {
    path: 'reactive-fields',
    title: pageTitle('reactive-fields'),
    loadComponent: () => import('./pages/reactive-fields').then((m) => m.ReactiveFields),
  },
  {
    path: 'signal-fields',
    title: pageTitle('signal-fields'),
    loadComponent: () => import('./pages/signal-fields').then((m) => m.SignalFields),
  },
  {
    path: 'right-to-left',
    title: pageTitle('right-to-left'),
    loadComponent: () => import('./pages/right-to-left').then((m) => m.RightToLeft),
  },
  {
    path: 'api',
    title: pageTitle('api'),
    loadComponent: () => import('./pages/api').then((m) => m.ApiReference),
  },
  {
    path: 'gotchas',
    title: pageTitle('gotchas'),
    loadComponent: () => import('./pages/gotchas').then((m) => m.Gotchas),
  },
  {
    path: 'ai-agents',
    title: pageTitle('ai-agents'),
    loadComponent: () => import('./pages/ai-agents').then((m) => m.AiAgents),
  },
  {
    path: 'roadmap',
    title: pageTitle('roadmap'),
    loadComponent: () => import('./pages/roadmap').then((m) => m.Roadmap),
  },
];
