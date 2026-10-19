import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { ZardDrawerImports } from './drawer.imports';
import { closingDirection } from './drawer.utils';

@Component({
  imports: [ZardDrawerImports],
  template: `
    <z-drawer [(zVisible)]="visible" zPlacement="right">
      <z-drawer-title>Title</z-drawer-title>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class DrawerDirectionHostComponent {
  readonly visible = signal(false);
}

describe('ZardDrawerComponent direction', () => {
  const change = new Subject<'ltr' | 'rtl'>();
  let direction: 'ltr' | 'rtl';

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  async function openIn(initial: 'ltr' | 'rtl') {
    direction = initial;
    await TestBed.configureTestingModule({
      imports: [DrawerDirectionHostComponent],
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
    const fixture = TestBed.createComponent(DrawerDirectionHostComponent);
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

  it('updates an open drawer in place when the direction changes', async () => {
    await openIn('rtl');

    direction = 'ltr';
    change.next('ltr');

    expect(document.querySelector('.cdk-overlay-container [dir="ltr"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).toBeNull();
    expect(document.querySelector('z-drawer-panel')).toBeTruthy();
  });

  it('keeps the placement physical: a right drawer stays on the right in rtl', async () => {
    await openIn('rtl');

    expect(document.querySelector('z-drawer-panel')?.getAttribute('data-placement')).toBe('right');
  });

  it('keeps the swipe axis physical: a right drawer closes towards +X, a left one towards -X', () => {
    expect(closingDirection('right')).toBe(1);
    expect(closingDirection('left')).toBe(-1);
  });
});
