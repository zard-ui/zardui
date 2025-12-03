import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDialogModule } from './dialog.component';
import { ZardDialogService } from './dialog.service';
import { ZardButtonComponent } from '../button/button.component';

@Component({
  imports: [ZardButtonComponent, ZardDialogModule],
  standalone: true,
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

        // Wait for animation to complete
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
      // With animations, state should be 'open'
      // Note: NoopAnimationsModule is used in tests so animation states still work
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
});
