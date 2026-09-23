import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardSheetService } from './sheet.service';
import { ZardButtonComponent } from '../button/button.component';

/** Default exit animation (200ms) plus a small margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 250;

@Component({
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Open sheet</button>
  `,
})
class SheetRefTestHostComponent {
  private readonly sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'Test Sheet',
      zDescription: 'This is a test sheet.',
      zContent: 'Test content',
    });
  }
}

describe('ZardSheetRef', () => {
  let fixture: ComponentFixture<SheetRefTestHostComponent>;
  let platformId: object;
  let sheetService: ZardSheetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetRefTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetRefTestHostComponent);
    platformId = TestBed.inject(PLATFORM_ID);
    sheetService = TestBed.inject(ZardSheetService);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll('z-sheet').forEach(sheet => sheet.remove());
  });

  describe('[signals]', () => {
    it('should reflect close state and result in isClosing/result signals', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const ref = sheetService.create<unknown, unknown>({ zTitle: 'Signal test', zContent: 'x' });

      expect(ref.isClosing()).toBe(false);
      expect(ref.result()).toBeUndefined();

      ref.close('done');

      expect(ref.isClosing()).toBe(true);
      expect(ref.result()).toBe('done');

      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
      expect(document.querySelector('z-sheet')).toBeNull();
    });

    it('should expose the content component instance', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const ref = sheetService.create({ zTitle: 'Instance', zContent: ZardButtonComponent });

      expect(ref.componentInstance()).toBeInstanceOf(ZardButtonComponent);

      ref.close();
      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    });

    it('should leave componentInstance null for string content', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const ref = sheetService.create({ zTitle: 'String', zContent: 'plain' });

      expect(ref.componentInstance()).toBeNull();

      ref.close();
      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    });
  });

  describe('[stack management]', () => {
    it('should only close the topmost sheet when Escape is pressed', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const first = sheetService.create({ zTitle: 'First', zContent: 'one' });
      const second = sheetService.create({ zTitle: 'Second', zContent: 'two' });
      await new Promise(resolve => setTimeout(resolve, 50));

      let sheets = document.querySelectorAll('z-sheet');
      expect(sheets.length).toBe(2);

      const topOverlay = sheets[1].closest('.cdk-overlay-pane') as HTMLElement;
      topOverlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));

      sheets = document.querySelectorAll('z-sheet');
      expect(sheets.length).toBe(1);
      expect(second.isClosing()).toBe(true);
      expect(first.isClosing()).toBe(false);
      expect(sheets[0].querySelector('[data-testid="z-title"]')?.textContent).toContain('First');

      first.close();
      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    });
  });

  describe('[focus restoration]', () => {
    it('should restore focus to the trigger button after close', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      trigger.click();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 50));

      const sheet = document.querySelector('z-sheet');
      expect(sheet).toBeTruthy();

      sheet?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]')?.click();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));

      expect(document.querySelector('z-sheet')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('[duration]', () => {
    it('should propagate zDuration to the --z-sheet-duration CSS custom property', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const ref = sheetService.create<unknown, unknown>({ zTitle: 'Duration', zContent: 'x', zDuration: 400 });
      await new Promise(resolve => setTimeout(resolve, 50));

      const sheet = document.querySelector('z-sheet') as HTMLElement;
      expect(sheet.style.getPropertyValue('--z-sheet-duration')).toBe('400ms');

      ref.close();

      // Still attached before the configured duration elapses.
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(document.querySelector('z-sheet')).toBeTruthy();

      await new Promise(resolve => setTimeout(resolve, 300));
      expect(document.querySelector('z-sheet')).toBeNull();
    });
  });

  describe('[mask]', () => {
    it('should not close on backdrop click when zMaskClosable is false', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const ref = sheetService.create({ zTitle: 'Masked', zContent: 'x', zMaskClosable: false });
      await new Promise(resolve => setTimeout(resolve, 50));

      const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      expect(backdrop).toBeTruthy();
      backdrop.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      backdrop.click();

      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
      expect(ref.isClosing()).toBe(false);
      expect(document.querySelector('z-sheet')).toBeTruthy();

      ref.close();
      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
    });
  });
});
