import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { lucideCheck, lucideX } from '@ng-icons/lucide';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';

import { ZardDialogOptions } from './dialog.component';
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
      zDescription: 'This is a test dialog.',
      zContent: 'Test content',
    });
  }
}

@Component({
  imports: [ZardDialogImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialogWithIcons()">Open dialog with icons</button>
  `,
})
class DialogWithIconsTestHostComponent {
  private dialogService = inject(ZardDialogService);

  openDialogWithIcons() {
    this.dialogService.create({
      zTitle: 'Confirm Action',
      zDescription: 'Are you sure?',
      zContent: 'This action cannot be undone.',
      zOkText: 'Confirm',
      zOkIcon: lucideCheck,
      zCancelText: 'Go Back',
      zCancelIcon: lucideX,
    });
  }
}

@Component({
  imports: [ZardDialogImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialogNoFooter()">Open dialog</button>
  `,
})
class DialogNoFooterTestHostComponent {
  private dialogService = inject(ZardDialogService);

  openDialogNoFooter() {
    this.dialogService.create({
      zTitle: 'No Footer Dialog',
      zContent: 'Content without footer',
      zHideFooter: true,
    });
  }
}

describe('ZardDialogComponent', () => {
  let platformId: object;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTestHostComponent, DialogWithIconsTestHostComponent, DialogNoFooterTestHostComponent],
    }).compileComponents();

    platformId = TestBed.inject(PLATFORM_ID);
  });

  afterEach(() => {
    const overlays = document.querySelectorAll('.cdk-overlay-container');
    overlays.forEach(overlay => overlay.remove());
  });

  describe('basic dialog', () => {
    let fixture: ComponentFixture<DialogTestHostComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DialogTestHostComponent);
      fixture.detectChanges();
    });

    function openDialog() {
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();
    }

    it('creates dialog with title, description and content', () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        expect(dialogElement).toBeTruthy();

        const titleElement = dialogElement?.querySelector('[data-testid="z-title"]');
        expect(titleElement?.textContent).toContain('Test Dialog');

        const descriptionElement = dialogElement?.querySelector('[data-testid="z-description"]');
        expect(descriptionElement?.textContent).toContain('This is a test dialog.');

        const contentElement = dialogElement?.querySelector('[data-testid="z-content"]');
        expect(contentElement?.textContent).toContain('Test content');
      }
    });

    it('displays close button by default', () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        const closeButton = dialogElement?.querySelector('[data-testid="z-close-header-button"]');
        expect(closeButton).toBeTruthy();
      }
    });

    it('closes dialog when close button is clicked', async () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        const closeButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
        closeButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 200));
        fixture.detectChanges();

        expect(document.querySelector('z-dialog')).toBeNull();
      }
    });

    it('closes dialog when cancel button is clicked', async () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        const cancelButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');
        cancelButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 200));
        fixture.detectChanges();

        expect(document.querySelector('z-dialog')).toBeNull();
      }
    });

    it('closes dialog when ok button is clicked', async () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        const okButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
        okButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 200));
        fixture.detectChanges();

        expect(document.querySelector('z-dialog')).toBeNull();
      }
    });
  });

  describe('dialog with icons', () => {
    let fixture: ComponentFixture<DialogWithIconsTestHostComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DialogWithIconsTestHostComponent);
      fixture.detectChanges();
    });

    function openDialog() {
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();
    }

    it('creates dialog with ok and cancel icons', () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        expect(dialogElement).toBeTruthy();

        const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
        expect(okButton?.textContent).toContain('Confirm');

        const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
        expect(cancelButton?.textContent).toContain('Go Back');
      }
    });

    it('renders ng-icon elements in buttons', () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');

        const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
        const okIcon = okButton?.querySelector('ng-icon');
        expect(okIcon).toBeTruthy();

        const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
        const cancelIcon = cancelButton?.querySelector('ng-icon');
        expect(cancelIcon).toBeTruthy();
      }
    });
  });

  describe('dialog without footer', () => {
    let fixture: ComponentFixture<DialogNoFooterTestHostComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DialogNoFooterTestHostComponent);
      fixture.detectChanges();
    });

    function openDialog() {
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();
    }

    it('hides footer when zHideFooter is true', () => {
      openDialog();

      if (isPlatformBrowser(platformId)) {
        const dialogElement = document.querySelector('z-dialog');
        expect(dialogElement).toBeTruthy();

        const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
        expect(okButton).toBeNull();

        const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
        expect(cancelButton).toBeNull();
      }
    });
  });
});

describe('ZardDialogOptions', () => {
  it('has default noop function for zOnOk', () => {
    const options = new ZardDialogOptions();
    expect(typeof options.zOnOk).toBe('function');
  });

  it('has default noop function for zOnCancel', () => {
    const options = new ZardDialogOptions();
    expect(typeof options.zOnCancel).toBe('function');
  });

  it('accepts string content', () => {
    const options = new ZardDialogOptions();
    options.zContent = 'Simple string';
    expect(options.zContent).toBe('Simple string');
  });

  it('accepts custom width', () => {
    const options = new ZardDialogOptions();
    options.zWidth = '600px';
    expect(options.zWidth).toBe('600px');
  });

  it('accepts custom classes', () => {
    const options = new ZardDialogOptions();
    options.zCustomClasses = 'my-custom-class';
    expect(options.zCustomClasses).toBe('my-custom-class');
  });

  it('accepts ok disabled option', () => {
    const options = new ZardDialogOptions();
    options.zOkDisabled = true;
    expect(options.zOkDisabled).toBe(true);
  });

  it('accepts ok destructive option', () => {
    const options = new ZardDialogOptions();
    options.zOkDestructive = true;
    expect(options.zOkDestructive).toBe(true);
  });

  it('accepts closable option as false', () => {
    const options = new ZardDialogOptions();
    options.zClosable = false;
    expect(options.zClosable).toBe(false);
  });

  it('accepts null for cancel text to hide button', () => {
    const options = new ZardDialogOptions();
    options.zCancelText = null;
    expect(options.zCancelText).toBeNull();
  });

  it('accepts null for ok text to hide button', () => {
    const options = new ZardDialogOptions();
    options.zOkText = null;
    expect(options.zOkText).toBeNull();
  });
});
