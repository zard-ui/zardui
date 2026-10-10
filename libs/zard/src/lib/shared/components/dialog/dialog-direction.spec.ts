import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { ZardDialogImports } from './dialog.imports';

@Component({
  imports: [ZardDialogImports],
  template: `
    <z-dialog [(zVisible)]="visible">
      <z-dialog-title>Title</z-dialog-title>
      <z-dialog-footer>
        <button type="button" data-testid="first">First</button>
        <button type="button" data-testid="second">Second</button>
      </z-dialog-footer>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class DialogDirectionHostComponent {
  readonly visible = signal(false);
}

describe('ZardDialogComponent direction', () => {
  const change = new Subject<'ltr' | 'rtl'>();
  let direction: 'ltr' | 'rtl';

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  async function openIn(initial: 'ltr' | 'rtl') {
    direction = initial;
    await TestBed.configureTestingModule({
      imports: [DialogDirectionHostComponent],
      providers: [
        {
          provide: Directionality,
          useValue: {
            get value() {
              return direction;
            },
            valueSignal: signal(initial),
            change,
          },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(DialogDirectionHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('opens the overlay with the direction of where it is declared', async () => {
    await openIn('rtl');

    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container [dir="ltr"]')).toBeNull();
  });

  it('keeps ltr when the declaration site is ltr', async () => {
    await openIn('ltr');

    expect(document.querySelector('.cdk-overlay-container [dir="ltr"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).toBeNull();
  });

  it('updates an open dialog in place when the direction changes', async () => {
    await openIn('rtl');

    direction = 'ltr';
    change.next('ltr');

    expect(document.querySelector('.cdk-overlay-container [dir="ltr"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).toBeNull();
    expect(document.querySelector('z-dialog-panel')).toBeTruthy();
  });

  it('puts the close button on the inline-end corner with a logical class', async () => {
    await openIn('rtl');

    const classes = document.querySelector('[data-slot="dialog-close"]')?.className ?? '';
    expect(classes).toContain('end-2');
    expect(classes).not.toMatch(/(^|\s)(ltr:|rtl:)?(left|right)-/);
  });

  it('leaves the centering physical so the dialog stays centered in rtl', async () => {
    await openIn('rtl');

    const classes = document.querySelector('z-dialog-panel')?.className ?? '';
    expect(classes).toContain('left-1/2');
    expect(classes).not.toContain('start-1/2');
  });
});
