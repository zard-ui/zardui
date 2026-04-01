import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { lucideCheck } from '@ng-icons/lucide';

import { ZardDialogRef } from './dialog-ref';
import { ZardDialogOptions } from './dialog.component';
import { ZardDialogService } from './dialog.service';

@Component({
  template: '<p>Test Content</p>',
})
class TestContentComponent {}

describe('ZardDialogService', () => {
  let service: ZardDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZardDialogService, Overlay],
    });

    service = TestBed.inject(ZardDialogService);
  });

  afterEach(() => {
    const overlays = document.querySelectorAll('.cdk-overlay-container');
    overlays.forEach(overlay => overlay.remove());
  });

  describe('create', () => {
    it('creates a dialog ref with string content', () => {
      const config = new ZardDialogOptions();
      config.zTitle = 'Test Dialog';
      config.zContent = 'Test Content';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates a dialog ref with component content', () => {
      const config = new ZardDialogOptions();
      config.zContent = TestContentComponent;

      const dialogRef = service.create<unknown, unknown>(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates a dialog ref with custom data', () => {
      const config = new ZardDialogOptions<unknown, { id: number }>();
      config.zContent = TestContentComponent;
      config.zData = { id: 123 };

      const dialogRef = service.create<unknown, { id: number }>(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });
  });

  describe('dialog options', () => {
    it('creates dialog with ok icon option', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zTitle = 'Confirm Action';
      config.zContent = 'Are you sure?';
      config.zOkIcon = lucideCheck;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
      expect(okButton).toBeTruthy();
      const okIcon = okButton?.querySelector('ng-icon');
      expect(okIcon).toBeTruthy();
    }));

    it('creates dialog with cancel icon option', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCancelIcon = '<svg>test</svg>';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
      expect(cancelButton).toBeTruthy();
      const cancelIcon = cancelButton?.querySelector('ng-icon');
      expect(cancelIcon).toBeTruthy();
    }));

    it('creates dialog with both ok and cancel icons', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zOkIcon = lucideCheck;
      config.zCancelIcon = '<svg>cancel</svg>';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
      const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
      expect(okButton?.querySelector('ng-icon')).toBeTruthy();
      expect(cancelButton?.querySelector('ng-icon')).toBeTruthy();
    }));

    it('creates dialog with zHideFooter option', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'No footer';
      config.zHideFooter = true;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const footer = dialogElement?.querySelector('footer');
      expect(footer).toBeNull();
    }));

    it('creates dialog with custom width', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Custom width';
      config.zWidth = '500px';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      expect(dialogElement?.getAttribute('style')).toContain('width: 500px');
    }));

    it('creates dialog with disabled ok button', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Disabled ok';
      config.zOkDisabled = true;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
      expect(okButton?.getAttribute('data-disabled')).toBe('true');
    }));

    it('creates dialog with destructive ok button', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Destructive action';
      config.zOkDestructive = true;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
      expect(okButton?.className).toContain('destructive');
    }));

    it('creates dialog with zClosable set to false', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Not closable';
      config.zClosable = false;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const closeButton = dialogElement?.querySelector('[data-testid="z-close-header-button"]');
      expect(closeButton).toBeNull();
    }));

    it('creates dialog with custom cancel text', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCancelText = 'Go Back';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
      expect(cancelButton?.textContent?.trim()).toBe('Go Back');
    }));

    it('creates dialog with custom ok text', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zOkText = 'Proceed';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
      expect(okButton?.textContent?.trim()).toBe('Proceed');
    }));

    it('creates dialog with hidden cancel button', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCancelText = null;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const cancelButton = dialogElement?.querySelector('[data-testid="z-cancel-button"]');
      expect(cancelButton).toBeNull();
    }));

    it('creates dialog with hidden ok button', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zOkText = null;

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const okButton = dialogElement?.querySelector('[data-testid="z-ok-button"]');
      expect(okButton).toBeNull();
    }));

    it('creates dialog with title and description', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zTitle = 'Dialog Title';
      config.zDescription = 'Dialog description text';
      config.zContent = 'Content';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      const titleElement = dialogElement?.querySelector('[data-testid="z-title"]');
      expect(titleElement?.textContent?.trim()).toBe('Dialog Title');
      const descriptionElement = dialogElement?.querySelector('[data-testid="z-description"]');
      expect(descriptionElement?.textContent?.trim()).toBe('Dialog description text');
    }));

    it('creates dialog with custom classes', fakeAsync(() => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCustomClasses = 'custom-class another-class';

      const dialogRef = service.create(config);
      tick();

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();
      expect(dialogElement?.classList.contains('custom-class')).toBe(true);
      expect(dialogElement?.classList.contains('another-class')).toBe(true);
    }));
  });

  describe('dialog ref', () => {
    it('returns a dialog ref with close method', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';

      const dialogRef = service.create(config);

      expect(typeof dialogRef.close).toBe('function');
    });

    it('returns a dialog ref with componentInstance property', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';

      const dialogRef = service.create(config);

      expect(dialogRef.componentInstance).toBeDefined();
    });
  });
});
