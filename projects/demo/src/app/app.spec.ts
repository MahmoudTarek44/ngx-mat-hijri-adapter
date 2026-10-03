import { TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('shows the unpublished package version', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('ngx-mat-hijri-adapter');
    expect(compiled.textContent).toContain('Workspace version 0.0.0.');
    expect(compiled.textContent).toContain('Umm al-Qura 1445-09-01 is Gregorian 2024-03-11.');
  });
});
