import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import type { ZardSheetSide } from './sheet-panel.component';
import { ZardSheetImports } from './sheet.imports';

/** Exit transition (200ms) plus a margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 300;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const panel = () => document.querySelector('z-sheet-panel');

@Component({
  imports: [ZardSheetImports],
  template: `
    <button type="button" data-testid="open" (click)="visible.set(true)">Open</button>
    <z-sheet [(zVisible)]="visible" [zSide]="side()" [zClosable]="closable()">
      <z-sheet-header>
        <z-sheet-title>Edit profile</z-sheet-title>
        <z-sheet-description>Make changes to your profile here.</z-sheet-description>
      </z-sheet-header>
      <p data-testid="content">Content</p>
      <z-sheet-footer>
        <button type="button" data-testid="close" z-sheet-close>Close</button>
      </z-sheet-footer>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class SheetHostComponent {
  readonly visible = signal(false);
  readonly side = signal<ZardSheetSide>('right');
  readonly closable = signal(true);
}

describe('ZardSheetComponent', () => {
  let fixture: ComponentFixture<SheetHostComponent>;
  let host: SheetHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SheetHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SheetHostComponent);
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
    expect(panel()?.getAttribute('data-side')).toBe('right');
    expect(panel()?.querySelector('[data-testid="content"]')).toBeTruthy();
  });

  it('opens from the requested side', async () => {
    host.side.set('left');
    await open();

    expect(panel()?.getAttribute('data-side')).toBe('left');
  });

  it('names the sheet with its title and description', async () => {
    await open();

    const title = panel()?.querySelector('[data-slot="sheet-title"]');
    const description = panel()?.querySelector('[data-slot="sheet-description"]');

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

  it('closes from a [z-sheet-close] control and disposes after the transition', async () => {
    await open();

    (panel()?.querySelector('[data-testid="close"]') as HTMLButtonElement).click();
    // No whenStable here: it would wait for the dispose timer and skip the transition state.
    fixture.detectChanges();

    expect(host.visible()).toBe(false);
    expect(panel()?.getAttribute('data-state')).toBe('closed');

    await wait(CLOSE_DELAY);
    expect(panel()).toBeNull();
  });

  it('closes on Escape', async () => {
    await open();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();

    expect(host.visible()).toBe(false);
  });
});
