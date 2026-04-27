import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';

import { ZardDialogService } from './dialog.service';

@Component({
  imports: [ZardDialogImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Open dialog</button>
  `,
})
class DialogTestHostComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Test Dialog',
      zDescription: `This is a test dialog.`,
      zContent: 'Teste',
    });
  }
}

describe('ZardDialogComponent', () => {
  let component: DialogTestHostComponent;
  let fixture: ComponentFixture<DialogTestHostComponent>;
  let platformId: object;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogTestHostComponent);
    component = fixture.componentInstance;
    platformId = TestBed.inject(PLATFORM_ID);
    fixture.detectChanges();
  });

  function openDialog() {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
  }

  describe('[onOkClick]', () => {
    it('should create a dialog when the button is clicked', () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');
      if (isPlatformBrowser(platformId)) {
        expect(dialogElement).toBeTruthy();
      } else {
        // In SSR environment, dialog should not be created
        expect(dialogElement).toBeNull();
      }
    });

    it('should display the dialog title, description and content', () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');

      if (isPlatformBrowser(platformId)) {
        expect(dialogElement).toBeTruthy();

        const titleElement = dialogElement?.querySelector('[data-testid="z-title"]');
        expect(titleElement).toBeTruthy();
        expect(titleElement?.textContent).toContain('Test Dialog');

        const descriptionElement = dialogElement?.querySelector('[data-testid="z-description"]');
        expect(descriptionElement).toBeTruthy();
        expect(descriptionElement?.textContent).toContain('This is a test dialog.');

        const contentElement = dialogElement?.querySelector('[data-testid="z-content"]');
        expect(contentElement).toBeTruthy();
        expect(contentElement?.textContent).toContain('Teste');
      } else {
        // In SSR environment, dialog should not be created
        expect(dialogElement).toBeNull();
      }
    });

    it('should close the dialog when the cancel button is clicked', async () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');

      if (isPlatformBrowser(platformId)) {
        expect(dialogElement).toBeTruthy();

        const cancelButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');
        expect(cancelButton).toBeTruthy();
        cancelButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 200));
        fixture.detectChanges();

        expect(document.querySelector('z-dialog')).toBeNull();
      } else {
        // In SSR environment, dialog should not be created
        expect(dialogElement).toBeNull();
      }
    });

    it('should close the dialog when the ok button is clicked', async () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');

      if (isPlatformBrowser(platformId)) {
        expect(dialogElement).toBeTruthy();

        const okButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
        expect(okButton).toBeTruthy();
        okButton?.click();
        fixture.detectChanges();

        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        fixture.detectChanges();

        expect(document.querySelector('z-dialog')).toBeNull();
      } else {
        // In SSR environment, dialog should not be created
        expect(dialogElement).toBeNull();
      }
    });
  });

  it('should close the dialog when the x button is clicked', async () => {
    openDialog();

    const dialogElement = document.querySelector('z-dialog');

    if (isPlatformBrowser(platformId)) {
      expect(dialogElement).toBeTruthy();

      const closeButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
      expect(closeButton).toBeTruthy();
      closeButton?.click();
      fixture.detectChanges();

      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();

      expect(document.querySelector('z-dialog')).toBeNull();
    } else {
      // In SSR environment, dialog should not be created
      expect(dialogElement).toBeNull();
    }
  });

  describe('[Animation States]', () => {
    it('should start with "close" state and transition to "open"', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      openDialog();

      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();

      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
    });

    it('should handle closing animation gracefully', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      openDialog();

      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();

      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();

      const closeButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
      closeButton?.click();
      fixture.detectChanges();

      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();

      expect(document.querySelector('z-dialog')).toBeNull();
    });

    it('should prevent multiple close() calls from queuing duplicate disposals', async () => {
      if (!isPlatformBrowser(platformId)) {
        return;
      }

      openDialog();

      await new Promise(resolve => setTimeout(resolve, 50));
      fixture.detectChanges();

      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();

      const closeButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');

      // Click close button multiple times rapidly
      closeButton?.click();
      closeButton?.click();
      closeButton?.click();
      fixture.detectChanges();

      await new Promise(resolve => setTimeout(resolve, 200));
      fixture.detectChanges();

      // Dialog should be closed without errors
      expect(document.querySelector('z-dialog')).toBeNull();
    });
  });

  describe('[a11y]', () => {
    it('should expose role=dialog and aria-modal on the host', () => {
      openDialog();

      if (!isPlatformBrowser(platformId)) return;

      const dialog = document.querySelector('z-dialog') as HTMLElement;
      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should link aria-labelledby to the title and aria-describedby to the description', () => {
      openDialog();

      if (!isPlatformBrowser(platformId)) return;

      const dialog = document.querySelector('z-dialog') as HTMLElement;
      const labelledBy = dialog.getAttribute('aria-labelledby');
      const describedBy = dialog.getAttribute('aria-describedby');

      expect(labelledBy).toBeTruthy();
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)?.textContent).toContain('Test Dialog');
      expect(document.getElementById(describedBy!)?.textContent).toContain('This is a test dialog.');
    });

    it('should restore focus to the trigger button after close', async () => {
      if (!isPlatformBrowser(platformId)) return;

      const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      trigger.click();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 50));

      const dialog = document.querySelector('z-dialog');
      expect(dialog).toBeTruthy();

      // Close the dialog
      const cancelBtn = dialog?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');
      cancelBtn?.click();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(document.querySelector('z-dialog')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('[stack management]', () => {
    it('should only close the topmost dialog when Escape is pressed', async () => {
      if (!isPlatformBrowser(platformId)) return;

      const dialogService = TestBed.inject(ZardDialogService);
      const first = dialogService.create({ zTitle: 'First', zContent: 'one' });
      const second = dialogService.create({ zTitle: 'Second', zContent: 'two' });
      await new Promise(resolve => setTimeout(resolve, 50));

      let dialogs = document.querySelectorAll('z-dialog');
      expect(dialogs.length).toBe(2);

      const topOverlay = dialogs[1].closest('.cdk-overlay-pane') as HTMLElement;
      topOverlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 200));

      dialogs = document.querySelectorAll('z-dialog');
      expect(dialogs.length).toBe(1);
      expect(second.isClosing()).toBe(true);
      expect(first.isClosing()).toBe(false);
      expect(dialogs[0].querySelector('[data-testid="z-title"]')?.textContent).toContain('First');

      first.close();
      await new Promise(resolve => setTimeout(resolve, 200));
    });
  });

  describe('[signals]', () => {
    it('should reflect close state and result in isClosing/result signals', async () => {
      if (!isPlatformBrowser(platformId)) return;

      const dialogService = TestBed.inject(ZardDialogService);
      const ref = dialogService.create<unknown, unknown>({ zTitle: 'Signal test', zContent: 'x' });

      expect(ref.isClosing()).toBe(false);
      expect(ref.result()).toBeUndefined();

      ref.close('done');

      expect(ref.isClosing()).toBe(true);
      expect(ref.result()).toBe('done');

      await new Promise(resolve => setTimeout(resolve, 200));
      expect(document.querySelector('z-dialog')).toBeNull();
    });
  });

  describe('[duration]', () => {
    it('should propagate zDuration to the --z-dialog-duration CSS custom property', async () => {
      if (!isPlatformBrowser(platformId)) return;

      const dialogService = TestBed.inject(ZardDialogService);
      dialogService.create<unknown, unknown>({ zTitle: 'Duration', zContent: 'x', zDuration: 250 });
      await new Promise(resolve => setTimeout(resolve, 50));

      const dialog = document.querySelector('z-dialog') as HTMLElement;
      expect(dialog.style.getPropertyValue('--z-dialog-duration')).toBe('250ms');

      dialog.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 300));
    });
  });
});
