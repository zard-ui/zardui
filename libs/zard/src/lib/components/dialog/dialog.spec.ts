import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ZardButtonComponent } from '../components';
import { ZardDialogModule } from './dialog.component';
import { ZardDialogService } from './dialog.service';

@Component({
  template: ` <button z-button zType="outline" (click)="openDialog()">Open dialog</button> `,
  imports: [ZardButtonComponent, ZardDialogModule],
  standalone: true,
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTestHostComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogTestHostComponent);
    component = fixture.componentInstance;
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
      expect(dialogElement).toBeTruthy();
    });

    it('should display the dialog title, description and content', () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');
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
    });

    it('should close the dialog when the cancel button is clicked', () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();

      const cancelButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');
      expect(cancelButton).toBeTruthy();
      cancelButton?.click();
      fixture.detectChanges();

      expect(document.querySelector('z-dialog')).toBeNull();
    });

    it('should close the dialog when the ok button is clicked', () => {
      openDialog();

      const dialogElement = document.querySelector('z-dialog');
      expect(dialogElement).toBeTruthy();

      const okButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
      expect(okButton).toBeTruthy();
      okButton?.click();
      fixture.detectChanges();

      expect(document.querySelector('z-dialog')).toBeNull();
    });
  });

  it('should close the dialog when the x button is clicked', () => {
    openDialog();

    const dialogElement = document.querySelector('z-dialog');
    expect(dialogElement).toBeTruthy();

    const closeButton = dialogElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
    expect(closeButton).toBeTruthy();
    closeButton?.click();
    fixture.detectChanges();

    expect(document.querySelector('z-dialog')).toBeNull();
  });
});
