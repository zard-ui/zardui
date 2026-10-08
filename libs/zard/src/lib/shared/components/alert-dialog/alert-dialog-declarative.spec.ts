import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardAlertDialogImports } from './alert-dialog.imports';

/** Exit transition (100ms) plus a margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 200;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const panel = () => document.querySelector('z-alert-dialog-panel');

@Component({
  imports: [ZardAlertDialogImports],
  template: `
    <z-alert-dialog [(zVisible)]="visible" [zSize]="size()" [zMaskClosable]="maskClosable()">
      <z-alert-dialog-header>
        <z-alert-dialog-media data-testid="media">!</z-alert-dialog-media>
        <z-alert-dialog-title>Delete chat?</z-alert-dialog-title>
        <z-alert-dialog-description>This cannot be undone.</z-alert-dialog-description>
      </z-alert-dialog-header>
      <z-alert-dialog-footer>
        <button type="button" data-testid="cancel" z-alert-dialog-close>Cancel</button>
        <button type="button" data-testid="confirm" (click)="confirm()">Delete</button>
      </z-alert-dialog-footer>
    </z-alert-dialog>
  `,
})
class AlertDialogHostComponent {
  readonly visible = signal(false);
  readonly size = signal<'default' | 'sm'>('default');
  readonly maskClosable = signal(false);
  confirmed = 0;

  confirm() {
    this.confirmed++;
    this.visible.set(false);
  }
}

describe('ZardAlertDialogComponent', () => {
  let fixture: ComponentFixture<AlertDialogHostComponent>;
  let host: AlertDialogHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AlertDialogHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(AlertDialogHostComponent);
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

  it('renders an alertdialog panel with the media, title and description', async () => {
    await open();

    expect(panel()?.getAttribute('role')).toBe('alertdialog');
    expect(panel()?.getAttribute('aria-modal')).toBe('true');
    expect(panel()?.getAttribute('data-size')).toBe('default');
    expect(panel()?.querySelector('[data-slot="alert-dialog-media"]')).toBeTruthy();

    const title = panel()?.querySelector('[data-slot="alert-dialog-title"]');
    const description = panel()?.querySelector('[data-slot="alert-dialog-description"]');
    expect(panel()?.getAttribute('aria-labelledby')).toBe(title?.getAttribute('id'));
    expect(panel()?.getAttribute('aria-describedby')).toBe(description?.getAttribute('id'));
  });

  it('reflects zSize on the panel', async () => {
    host.size.set('sm');
    await open();

    expect(panel()?.getAttribute('data-size')).toBe('sm');
  });

  it('closes from a [z-alert-dialog-close] control and disposes after the transition', async () => {
    await open();

    (panel()?.querySelector('[data-testid="cancel"]') as HTMLButtonElement).click();
    // No whenStable here: it would wait for the dispose timer and skip the transition state.
    fixture.detectChanges();

    expect(host.visible()).toBe(false);
    expect(panel()?.getAttribute('data-state')).toBe('closed');

    await wait(CLOSE_DELAY);
    expect(panel()).toBeNull();
  });

  it('lets an action button close it through zVisible', async () => {
    await open();

    (panel()?.querySelector('[data-testid="confirm"]') as HTMLButtonElement).click();
    await settle();

    expect(host.confirmed).toBe(1);
    expect(host.visible()).toBe(false);
  });

  it('ignores mask clicks by default and honours zMaskClosable', async () => {
    await open();
    const backdrop = () => document.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop().click();
    await settle();
    expect(host.visible()).toBe(true);

    host.maskClosable.set(true);
    await settle();
    backdrop().click();
    await settle();
    expect(host.visible()).toBe(false);
  });
});
