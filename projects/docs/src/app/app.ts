import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NGX_MAT_HIJRI_ADAPTER_VERSION } from 'ngx-mat-hijri-adapter';

import { REPOSITORY_URL } from './links';
import { Logo } from './shared/logo';
import { Theme, type ThemeMode } from './theme/theme';

const THEME_ICONS: Record<ThemeMode, string> = {
  light: 'light_mode',
  dark: 'dark_mode',
  system: 'contrast',
};

@Component({
  selector: 'root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButton,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
    Logo,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly theme = inject(Theme);
  protected readonly version = NGX_MAT_HIJRI_ADAPTER_VERSION;
  protected readonly repositoryUrl = REPOSITORY_URL;
  protected readonly tagUrl = `${REPOSITORY_URL}/releases/tag/${NGX_MAT_HIJRI_ADAPTER_VERSION}`;
  protected readonly themeIcons = THEME_ICONS;
  protected readonly themeModes: readonly ThemeMode[] = ['light', 'dark', 'system'];
}
