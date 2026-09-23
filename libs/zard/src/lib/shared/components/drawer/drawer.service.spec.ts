import { Component, inject, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDrawerRef } from './drawer-ref';
import { ZardDrawerImports } from './drawer.imports';
import { injectDrawerData, ZardDrawerService } from './drawer.service';

/** Exit animation (450ms) plus a margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 550;
const panel = () => document.querySelector('z-drawer-panel');
const backdrop = () => document.querySelector<HTMLElement>('.cdk-overlay-backdrop');

/** The CDK keyboard dispatcher listens on `body`, so that is where the key has to land. */
const pressEscape = () => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

@Component({
  imports: [ZardDrawerImports],
  template: `
    <ng-template #tpl let-ref="drawerRef">
      <p data-testid="tpl">from template</p>
      <button type="button" data-testid="tpl-close" (click)="ref.close('tpl-result')">Close</button>
    </ng-template>
  `,
})
class HostComponent {
  readonly tpl = viewChild.required<TemplateRef<void>>('tpl');
}

@Component({
  template: `
    <p data-testid="data">{{ data.label }}</p>
  `,
})
class DataContentComponent {
  readonly data = injectDrawerData<{ label: string }>();
  readonly ref = inject(ZardDrawerRef);
}

describe('ZardDrawerService behaviour', () => {
  let fixture: ComponentFixture<HostComponent>;
  let service: ZardDrawerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    service = TestBed.inject(ZardDrawerService);
    fixture.detectChanges();
  });

  afterEach(() => document.querySelectorAll('.cdk-overlay-container').forEach(n => n.remove()));

  async function create(config: Parameters<ZardDrawerService['create']>[0]) {
    const ref = service.create(config);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return ref;
  }

  it('renders a TemplateRef and exposes drawerRef in its context', async () => {
    const ref = await create({ zTitle: 'T', zContent: fixture.componentInstance.tpl() });
    expect(document.querySelector('[data-testid="tpl"]')).toBeTruthy();

    document.querySelector<HTMLButtonElement>('[data-testid="tpl-close"]')?.click();
    expect(ref.result()).toBe('tpl-result');
  });

  it('injects zData into component content', async () => {
    const ref = await create({ zTitle: 'T', zContent: DataContentComponent, zData: { label: 'hello' } });
    expect(document.querySelector('[data-testid="data"]')?.textContent).toContain('hello');
    expect((ref.componentInstance() as DataContentComponent).ref).toBeInstanceOf(ZardDrawerRef);
  });

  it('keeps the drawer open when zOnOk returns false', async () => {
    const ref = await create({ zTitle: 'T', zContent: 'x', zOnOk: () => false });
    document.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]')?.click();
    fixture.detectChanges();
    expect(ref.isClosing()).toBe(false);
    expect(panel()).toBeTruthy();
  });

  it('closes on mask click, and not when zMaskClosable is false', async () => {
    const a = await create({ zTitle: 'A', zContent: 'x' });
    backdrop()?.click();
    fixture.detectChanges();
    expect(a.isClosing()).toBe(true);
    await new Promise(r => setTimeout(r, CLOSE_DELAY));

    const b = await create({ zTitle: 'B', zContent: 'x', zMaskClosable: false });
    backdrop()?.click();
    fixture.detectChanges();
    expect(b.isClosing()).toBe(false);
  });

  it('does not dismiss a non-modal drawer on an outside press', async () => {
    const ref = await create({ zTitle: 'NM', zContent: 'x', zMask: false });
    expect(backdrop()).toBeNull();

    document.body.click();
    fixture.detectChanges();
    expect(ref.isClosing()).toBe(false);
    expect(panel()).toBeTruthy();
  });

  it('closes on Escape, and not when zDismissible is false', async () => {
    const a = await create({ zTitle: 'A', zContent: 'x' });
    pressEscape();
    fixture.detectChanges();
    expect(a.isClosing()).toBe(true);
    await new Promise(r => setTimeout(r, CLOSE_DELAY));

    const b = await create({ zTitle: 'B', zContent: 'x', zDismissible: false });
    pressEscape();
    fixture.detectChanges();
    expect(b.isClosing()).toBe(false);
  });
});
