import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDialogImports } from './dialog.imports';

/** Exit transition (100ms) plus a margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 200;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const panel = () => document.querySelector('z-dialog-panel');

@Component({
  imports: [ZardDialogImports],
  template: `
    <button type="button" data-testid="open" (click)="visible.set(true)">Open</button>
    <z-dialog [(zVisible)]="visible" [zClosable]="closable()" [zMaskClosable]="maskClosable()">
      <z-dialog-header>
        <z-dialog-title>Edit profile</z-dialog-title>
        <z-dialog-description>Make changes to your profile here.</z-dialog-description>
      </z-dialog-header>
      <p data-testid="content">Content</p>
      <z-dialog-footer>
        <button type="button" data-testid="close" z-dialog-close>Cancel</button>
      </z-dialog-footer>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class DialogHostComponent {
  readonly visible = signal(false);
  readonly closable = signal(true);
  readonly maskClosable = signal(true);
}

describe('ZardDialogComponent', () => {
  let fixture: ComponentFixture<DialogHostComponent>;
  let host: DialogHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DialogHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DialogHostComponent);
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

  async function open() {
    host.visible.set(true);
    await settle();
  }

  it('stays closed until zVisible turns true', () => {
    expect(panel()).toBeNull();
  });

  it('renders the panel with its content once opened', async () => {
    await open();

    expect(panel()).toBeTruthy();
    expect(panel()?.getAttribute('role')).toBe('dialog');
    expect(panel()?.getAttribute('aria-modal')).toBe('true');
    expect(panel()?.querySelector('[data-testid="content"]')).toBeTruthy();
  });

  it('names the dialog with its title and description', async () => {
    await open();

    const title = panel()?.querySelector('[data-slot="dialog-title"]');
    const description = panel()?.querySelector('[data-slot="dialog-description"]');

    expect(title?.getAttribute('id')).toBeTruthy();
    expect(panel()?.getAttribute('aria-labelledby')).toBe(title?.getAttribute('id'));
    expect(panel()?.getAttribute('aria-describedby')).toBe(description?.getAttribute('id'));
  });

  it('renders the corner close button unless zClosable is false', async () => {
    await open();
    expect(panel()?.querySelector('[data-testid="z-close-header-button"]')).toBeTruthy();

    host.closable.set(false);
    await settle();
    expect(panel()?.querySelector('[data-testid="z-close-header-button"]')).toBeNull();
  });

  it('closes from a [z-dialog-close] control and disposes after the transition', async () => {
    await open();

    (panel()?.querySelector('[data-testid="close"]') as HTMLButtonElement).click();
    // No whenStable here: it would wait for the dispose timer and skip the transition state.
    fixture.detectChanges();

    expect(host.visible()).toBe(false);
    expect(panel()?.getAttribute('data-state')).toBe('closed');

    await wait(CLOSE_DELAY);
    expect(panel()).toBeNull();
  });

  it('closes from the corner close button', async () => {
    await open();

    (panel()?.querySelector('[data-testid="z-close-header-button"]') as HTMLButtonElement).click();
    await settle();

    expect(host.visible()).toBe(false);
  });

  it('closes on Escape', async () => {
    await open();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();

    expect(host.visible()).toBe(false);
  });

  it('closes on a mask click only while zMaskClosable is true', async () => {
    await open();
    const backdrop = () => document.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    host.maskClosable.set(false);
    await settle();
    backdrop().click();
    await settle();
    expect(host.visible()).toBe(true);

    host.maskClosable.set(true);
    await settle();
    backdrop().click();
    await settle();
    expect(host.visible()).toBe(false);
  });

  it('reopens mid-exit without recreating the panel', async () => {
    await open();
    const first = panel();

    host.visible.set(false);
    fixture.detectChanges();
    host.visible.set(true);
    fixture.detectChanges();

    expect(panel() === first).toBe(true);
    expect(panel()?.getAttribute('data-state')).toBe('open');
  });
});
