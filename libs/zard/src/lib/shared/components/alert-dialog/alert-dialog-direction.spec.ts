import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { ZardAlertDialogImports } from './alert-dialog.imports';

@Component({
  imports: [ZardAlertDialogImports],
  template: `
    <z-alert-dialog [(zVisible)]="visible">
      <z-alert-dialog-title>Title</z-alert-dialog-title>
      <z-alert-dialog-footer>
        <button type="button" z-alert-dialog-close>Cancel</button>
      </z-alert-dialog-footer>
    </z-alert-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class AlertDialogDirectionHostComponent {
  readonly visible = signal(false);
}

describe('ZardAlertDialogComponent direction', () => {
  const change = new Subject<'ltr' | 'rtl'>();
  let direction: 'ltr' | 'rtl';

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  async function openIn(initial: 'ltr' | 'rtl') {
    direction = initial;
    await TestBed.configureTestingModule({
      imports: [AlertDialogDirectionHostComponent],
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
    const fixture = TestBed.createComponent(AlertDialogDirectionHostComponent);
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

  it('updates an open alert dialog in place when the direction changes', async () => {
    await openIn('rtl');

    direction = 'ltr';
    change.next('ltr');

    expect(document.querySelector('.cdk-overlay-container [dir="ltr"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).toBeNull();
    expect(document.querySelector('z-alert-dialog-panel')).toBeTruthy();
  });

  it('leaves the centering physical so the dialog stays centered in rtl', async () => {
    await openIn('rtl');

    const classes = document.querySelector('z-alert-dialog-panel')?.className ?? '';
    expect(classes).toContain('left-1/2');
    expect(classes).not.toContain('start-1/2');
  });

  it('keeps the footer free of physical alignment so flex order mirrors by itself', async () => {
    await openIn('rtl');

    const footer = document.querySelector('z-alert-dialog-footer');
    expect(footer?.className ?? '').not.toMatch(/(^|\s)(ml|mr|pl|pr|left|right|text-left|text-right)-/);
  });
});
