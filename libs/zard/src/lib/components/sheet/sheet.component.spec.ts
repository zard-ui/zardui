import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ZardSheetRef } from './sheet-ref';
import { ZardSheetService } from './sheet.service';
import { ZardButtonComponent } from '../button/button.component';

@Component({
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Open basic sheet</button>
    <button type="button" z-button zType="outline" (click)="openSheetWithTemplate()">Open sheet with template</button>
    <button type="button" z-button zType="outline" (click)="openSheetRightSide()">Open right side sheet</button>
    <button type="button" z-button zType="outline" (click)="openSheetWithoutFooter()">Open sheet without footer</button>

    <ng-template #testTemplate let-sheetRef="sheetRef">
      <div data-testid="template-content">
        <p>Template content</p>
        <button type="button" (click)="sheetRef.close()">Close from template</button>
      </div>
    </ng-template>
  `,
  imports: [ZardButtonComponent],
  standalone: true,
})
class SheetTestHostComponent {
  private sheetService = inject(ZardSheetService);

  @ViewChild('testTemplate', { static: true }) testTemplate!: TemplateRef<void>;
  public lastSheetRef?: ZardSheetRef<void>;

  openSheet() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'Test Sheet',
      zDescription: 'This is a test sheet.',
      zContent: 'Test content',
    });
  }

  openSheetWithTemplate() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'Template Sheet',
      zContent: this.testTemplate,
    });
  }

  openSheetRightSide() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'Right Side Sheet',
      zContent: 'Right side content',
      zSide: 'right',
    });
  }

  openSheetWithoutFooter() {
    this.lastSheetRef = this.sheetService.create({
      zTitle: 'No Footer Sheet',
      zContent: 'No footer content',
      zHideFooter: true,
    });
  }
}

describe('ZardSheetComponent', () => {
  let component: SheetTestHostComponent;
  let fixture: ComponentFixture<SheetTestHostComponent>;
  let platformId: object;
  let sheetService: ZardSheetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetTestHostComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SheetTestHostComponent);
    component = fixture.componentInstance;
    platformId = TestBed.inject(PLATFORM_ID);
    sheetService = TestBed.inject(ZardSheetService);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any open sheets
    const sheetElements = document.querySelectorAll('z-sheet');
    sheetElements.forEach(sheet => sheet.remove());
  });

  function openSheet() {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
  }

  function openSheetByIndex(index: number) {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[index].click();
    fixture.detectChanges();
  }

  describe('Basic functionality', () => {
    it('should create a sheet when the button is clicked', () => {
      openSheet();

      const sheetElement = document.querySelector('z-sheet');
      if (isPlatformBrowser(platformId)) {
        expect(sheetElement).toBeTruthy();
        expect(sheetElement?.getAttribute('data-state')).toBe('open');
      } else {
        expect(sheetElement).toBeNull();
      }
    });

    it('should display the sheet title, description and content', () => {
      openSheet();

      const sheetElement = document.querySelector('z-sheet');

      if (isPlatformBrowser(platformId)) {
        expect(sheetElement).toBeTruthy();

        const titleElement = sheetElement?.querySelector('[data-testid="z-title"]');
        expect(titleElement).toBeTruthy();
        expect(titleElement?.textContent).toContain('Test Sheet');

        const descriptionElement = sheetElement?.querySelector('[data-testid="z-description"]');
        expect(descriptionElement).toBeTruthy();
        expect(descriptionElement?.textContent).toContain('This is a test sheet.');

        const contentElement = sheetElement?.querySelector('[data-testid="z-content"]');
        expect(contentElement).toBeTruthy();
        expect(contentElement?.textContent).toContain('Test content');
      } else {
        expect(sheetElement).toBeNull();
      }
    });
  });

  describe('Sheet interactions', () => {
    it('should close the sheet when the cancel button is clicked', async () => {
      openSheet();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const cancelButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');
        expect(cancelButton).toBeTruthy();
        cancelButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 350));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });

    it('should close the sheet when the ok button is clicked', async () => {
      openSheet();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const okButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
        expect(okButton).toBeTruthy();
        okButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 350));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });

    it('should close the sheet when the x button is clicked', async () => {
      openSheet();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const closeButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
        expect(closeButton).toBeTruthy();
        closeButton?.click();
        fixture.detectChanges();

        await new Promise(resolve => setTimeout(resolve, 350));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });
  });

  describe('Sheet variants', () => {
    it('should create a sheet with right side variant', () => {
      openSheetByIndex(2); // Right side sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();
        expect(sheetElement?.classList.contains('right-0')).toBeTruthy();
        expect(sheetElement?.classList.contains('border-l')).toBeTruthy();
      }
    });

    it('should create a sheet without footer when hideFooter is true', () => {
      openSheetByIndex(3); // No footer sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const footerElement = sheetElement?.querySelector('[data-slot="sheet-footer"]');
        expect(footerElement).toBeNull();

        const okButton = sheetElement?.querySelector('[data-testid="z-ok-button"]');
        const cancelButton = sheetElement?.querySelector('[data-testid="z-cancel-button"]');
        expect(okButton).toBeNull();
        expect(cancelButton).toBeNull();
      }
    });
  });

  describe('Template content', () => {
    it('should render template content correctly', () => {
      openSheetByIndex(1); // Template sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const templateContent = sheetElement?.querySelector('[data-testid="template-content"]');
        expect(templateContent).toBeTruthy();
        expect(templateContent?.textContent).toContain('Template content');
      }
    });
  });

  describe('SSR compatibility', () => {
    it('should handle SSR environment gracefully', () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeNull();
        expect(component.lastSheetRef).toBeTruthy();
      }
    });
  });

  describe('Sheet service', () => {
    it('should create sheet with custom configuration', () => {
      const sheetRef = sheetService.create({
        zTitle: 'Custom Sheet',
        zContent: 'Custom content',
        zOkText: 'Save',
        zCancelText: 'Discard',
        zSide: 'top',
      });

      expect(sheetRef).toBeTruthy();

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet') as HTMLElement;
        expect(sheetElement).toBeTruthy();
      }
    });

    it('should apply custom width and height', async () => {
      sheetService.create({
        zTitle: 'Custom Dimensions Sheet',
        zContent: 'Custom content',
        zSide: 'right',
        zWidth: '500px',
        zHeight: '80vh',
      });

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet') as HTMLElement;
        expect(sheetElement).toBeTruthy();

        // Wait for change detection
        fixture.detectChanges();
        await fixture.whenStable();

        // Check that custom dimensions are applied via CSS variables
        expect(sheetElement.style.width).toBe('500px');
        expect(sheetElement.style.height).toBe('80vh');
      }
    });

    it('should apply default dimensions based on side', async () => {
      sheetService.create({
        zTitle: 'Default Dimensions Sheet',
        zContent: 'Default content',
        zSide: 'left',
      });

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet') as HTMLElement;
        expect(sheetElement).toBeTruthy();

        // Wait for change detection
        fixture.detectChanges();
        await fixture.whenStable();

        // Check that default dimensions use Tailwind classes (no inline styles)
        expect(sheetElement.style.width).toBe('');
        expect(sheetElement.style.height).toBe('');
        expect(sheetElement?.classList.contains('w-3/4')).toBeTruthy();
        expect(sheetElement?.classList.contains('h-full')).toBeTruthy();
      }
    });

    it('should handle sheet callbacks', () => {
      let okClicked = false;
      let cancelClicked = false;

      sheetService.create({
        zTitle: 'Callback Sheet',
        zContent: 'Callback content',
        zOnOk: () => {
          okClicked = true;
          return false;
        }, // return false to prevent closing
        zOnCancel: () => {
          cancelClicked = true;
          return false;
        }, // return false to prevent closing
      });

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();

        const okButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
        const cancelButton = sheetElement?.querySelector<HTMLButtonElement>('[data-testid="z-cancel-button"]');

        if (okButton && cancelButton) {
          okButton.click();
          fixture.detectChanges();
          expect(okClicked).toBeTruthy();

          cancelButton.click();
          fixture.detectChanges();
          expect(cancelClicked).toBeTruthy();
        }
      }
    });
  });
});
