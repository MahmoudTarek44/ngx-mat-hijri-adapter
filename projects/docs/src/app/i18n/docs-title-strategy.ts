import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, type RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/** Route titles are translation keys, refreshed when the language changes. */
@Injectable()
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private last: RouterStateSnapshot | null = null;

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => {
      if (this.last) {
        this.apply(this.last);
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.last = snapshot;
    this.apply(snapshot);
  }

  private apply(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    if (key) {
      this.title.setTitle(this.translate.instant(key));
    }
  }
}
