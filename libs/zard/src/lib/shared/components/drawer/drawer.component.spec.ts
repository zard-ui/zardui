import { Component, inject, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDrawerRef } from './drawer-ref';
import { ZardDrawerImports } from './drawer.imports';
import { ZardDrawerService } from './drawer.service';

/** Exit animation (450ms) plus a margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 550;

const panel = () => document.querySelector('z-drawer-panel');

@Component({
  imports: [ZardDrawerImports],
  template: `
    <button type="button" (click)="visible.set(true)">Open</button>

    <z-drawer [(zVisible)]="visible" [zPlacement]="placement()" [zDismissible]="dismissible()">
      <z-drawer-header>
        <z-drawer-title>Move goal</z-drawer-title>
        <z-drawer-description>Set your daily activity goal.</z-drawer-description>
      </z-drawer-header>

      <z-drawer-footer>
        <button type="button" data-testid="close" z-drawer-close>Cancel</button>
      </z-drawer-footer>
    </z-drawer>
  `,
})
class DrawerHostComponent {
  readonly visible = signal(false);
  readonly placement = signal<'top' | 'right' | 'bottom' | 'left'>('bottom');
  readonly dismissible = signal(true);
}

@Component({
  template: `
    <p data-testid="service-content">Service content</p>
  `,
})
class DrawerServiceContentComponent {
  readonly drawerRef = inject(ZardDrawerRef, { optional: true });
}

@Component({
  imports: [ZardDrawerImports],
  template: `
    <z-drawer [(zVisible)]="outer">
      <z-drawer-title>Outer</z-drawer-title>
    </z-drawer>

    <z-drawer [(zVisible)]="inner">
      <z-drawer-title>Inner</z-drawer-title>
    </z-drawer>
  `,
})
class DrawerNestedComponent {
  readonly outer = signal(false);
  readonly inner = signal(false);
}

@Component({
  imports: [ZardDrawerImports],
  template: `
    <z-drawer [zVisible]="true" [zSnapPoints]="snapPoints" [zSnapPoint]="snapPoints[0]">
      <z-drawer-header>
        <z-drawer-title>Open on load</z-drawer-title>
      </z-drawer-header>
    </z-drawer>
  `,
})
class DrawerInitiallyOpenComponent {
  readonly snapPoints = ['20rem', 1];
}

describe('ZardDrawerComponent', () => {
  let fixture: ComponentFixture<DrawerHostComponent>;
  let host: DrawerHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DrawerHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(DrawerHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  async function open() {
    host.visible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('stays closed until zVisible turns true', () => {
    expect(panel()).toBeNull();
  });

  it('renders the panel with its content once opened', async () => {
    await open();

    expect(panel()).toBeTruthy();
    expect(panel()?.getAttribute('role')).toBe('dialog');
    expect(panel()?.getAttribute('data-placement')).toBe('bottom');
    expect(panel()?.textContent).toContain('Move goal');
  });

  it('opens from the requested edge', async () => {
    host.placement.set('right');
    await open();

    expect(panel()?.getAttribute('data-placement')).toBe('right');
  });

  it('names the drawer with its title and description', async () => {
    await open();

    const labelledBy = panel()?.getAttribute('aria-labelledby');
    const describedBy = panel()?.getAttribute('aria-describedby');

    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy as string)?.textContent).toContain('Move goal');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)?.textContent).toContain('Set your daily activity goal.');
  });

  it('closes when a [z-drawer-close] control is clicked', async () => {
    await open();

    document.querySelector<HTMLButtonElement>('[data-testid="close"]')?.click();
    fixture.detectChanges();

    expect(host.visible()).toBe(false);

    await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('ignores dismiss requests when zDismissible is false', async () => {
    host.dismissible.set(false);
    await open();

    document.querySelector<HTMLButtonElement>('[data-testid="close"]')?.click();
    fixture.detectChanges();

    expect(host.visible()).toBe(true);
    expect(panel()).toBeTruthy();
  });

  it('plays the exit animation before removing the overlay', async () => {
    await open();

    host.visible.set(false);
    fixture.detectChanges();

    expect(panel()?.getAttribute('data-state')).toBe('closed');

    await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });
});

describe('ZardDrawerComponent opened on load', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  it('opens at its first snap point without waiting for an interaction', async () => {
    await TestBed.configureTestingModule({ imports: [DrawerInitiallyOpenComponent] }).compileComponents();

    const fixture = TestBed.createComponent(DrawerInitiallyOpenComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // 20rem of the test viewport stays visible, the rest is translated away.
    const expected = window.innerHeight - 20 * 16;

    expect(panel()).toBeTruthy();
    expect(panel()?.getAttribute('style')).toContain(`translate3d(0, ${expected}px, 0)`);
    expect(panel()?.getAttribute('data-snap-points')).toBe('');
  });
});

describe('ZardDrawerComponent stacking', () => {
  let fixture: ComponentFixture<DrawerNestedComponent>;
  let host: DrawerNestedComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DrawerNestedComponent] }).compileComponents();

    fixture = TestBed.createComponent(DrawerNestedComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('marks the drawer underneath as stacked and shrinks it', async () => {
    host.outer.set(true);
    await settle();

    const [outer] = [...document.querySelectorAll('z-drawer-panel')];
    expect(outer.getAttribute('data-nested-open')).toBeNull();

    host.inner.set(true);
    await settle();

    const panels = [...document.querySelectorAll('z-drawer-panel')];
    expect(panels).toHaveLength(2);
    expect(panels[0].getAttribute('data-nested-open')).toBe('');
    expect(panels[0].getAttribute('style')).toContain('scale(0.95)');
    expect(panels[1].getAttribute('data-nested-open')).toBeNull();
  });

  it('leaves the second mask see-through so the two do not compound', async () => {
    host.outer.set(true);
    await settle();
    host.inner.set(true);
    await settle();

    const backdrops = [...document.querySelectorAll('.cdk-overlay-backdrop')];
    expect(backdrops).toHaveLength(2);
    expect(backdrops[0].classList.contains('bg-black/30')).toBe(true);
    expect(backdrops[1].classList.contains('bg-transparent')).toBe(true);
  });
});

describe('ZardDrawerService', () => {
  let fixture: ComponentFixture<DrawerHostComponent>;
  let service: ZardDrawerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DrawerHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(DrawerHostComponent);
    service = TestBed.inject(ZardDrawerService);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  async function create(config: Parameters<ZardDrawerService['create']>[0]) {
    const ref = service.create(config);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return ref;
  }

  it('renders title, description and string content', async () => {
    await create({ zTitle: 'Move goal', zDescription: 'Set your goal.', zContent: 'Plain content' });

    expect(document.querySelector('[data-testid="z-title"]')?.textContent).toContain('Move goal');
    expect(document.querySelector('[data-testid="z-description"]')?.textContent).toContain('Set your goal.');
    expect(document.querySelector('[data-testid="z-content"]')?.textContent).toContain('Plain content');
  });

  it('exposes the projected component instance on the ref', async () => {
    const ref = await create({ zTitle: 'Component content', zContent: DrawerServiceContentComponent });

    expect(document.querySelector('[data-testid="service-content"]')).toBeTruthy();
    expect(ref.componentInstance()).toBeInstanceOf(DrawerServiceContentComponent);
  });

  it('closes with a result and disposes the overlay', async () => {
    const ref = await create({ zTitle: 'Closing', zContent: 'Bye' });

    ref.close('saved');
    fixture.detectChanges();

    expect(ref.isClosing()).toBe(true);
    expect(ref.result()).toBe('saved');

    await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    expect(panel()).toBeNull();
  });

  it('hides the footer when asked', async () => {
    await create({ zTitle: 'No footer', zContent: 'Body', zHideFooter: true });

    expect(document.querySelector('[data-testid="z-ok-button"]')).toBeNull();
    expect(document.querySelector('[data-testid="z-cancel-button"]')).toBeNull();
  });
});
