import { DOCUMENT, Service, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ngx-mat-hijri-adapter-theme';
const MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

/** Applies the chosen color scheme as a class on `<html>` and remembers it. */
@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;

  readonly mode = signal<ThemeMode>(this.stored());

  constructor() {
    effect(() => {
      const mode = this.mode();
      const root = this.document.documentElement;
      root.classList.toggle('light', mode === 'light');
      root.classList.toggle('dark', mode === 'dark');
      this.storage?.setItem(STORAGE_KEY, mode);
    });
  }

  private stored(): ThemeMode {
    const value = this.storage?.getItem(STORAGE_KEY);
    return MODES.find((mode) => mode === value) ?? 'system';
  }
}
