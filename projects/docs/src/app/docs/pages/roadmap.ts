import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'roadmap',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './roadmap.html',
})
export class Roadmap {
  protected readonly implemented: readonly string[] = [
    'twoCalendars',
    'locale',
    'calendarDate',
    'calendarOf',
    'native',
    'datepicker',
    'fields',
    'toggle',
    'formats',
    'parsing',
    'rtl',
    'ngAdd',
    'agents',
    'docsI18n',
  ] as const;

  protected readonly inDevelopment: readonly string[] = ['toggleTemplates'];

  protected readonly future: readonly string[] = ['stable', 'changelog', 'migrations', 'mcp'];
}
