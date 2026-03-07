import { Overlay } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZardDialogRef } from './dialog-ref';
import { ZardDialogOptions } from './dialog.component';
import { ZardDialogService } from './dialog.service';
import { zardCheckIcon } from '../../core/icons-registry';

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
    it('creates dialog with ok icon option', () => {
      const config = new ZardDialogOptions();
      config.zTitle = 'Confirm Action';
      config.zContent = 'Are you sure?';
      config.zOkIcon = zardCheckIcon;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with cancel icon option', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCancelIcon = '<svg>test</svg>';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with both ok and cancel icons', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zOkIcon = zardCheckIcon;
      config.zCancelIcon = '<svg>cancel</svg>';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with zHideFooter option', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'No footer';
      config.zHideFooter = true;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with custom width', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Custom width';
      config.zWidth = '500px';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with disabled ok button', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Disabled ok';
      config.zOkDisabled = true;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with destructive ok button', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Destructive action';
      config.zOkDestructive = true;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with zClosable set to false', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Not closable';
      config.zClosable = false;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with custom cancel text', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCancelText = 'Go Back';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with custom ok text', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zOkText = 'Proceed';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with hidden cancel button', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCancelText = null;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with hidden ok button', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zOkText = null;

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with title and description', () => {
      const config = new ZardDialogOptions();
      config.zTitle = 'Dialog Title';
      config.zDescription = 'Dialog description text';
      config.zContent = 'Content';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });

    it('creates dialog with custom classes', () => {
      const config = new ZardDialogOptions();
      config.zContent = 'Test';
      config.zCustomClasses = 'custom-class another-class';

      const dialogRef = service.create(config);

      expect(dialogRef).toBeInstanceOf(ZardDialogRef);
    });
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
