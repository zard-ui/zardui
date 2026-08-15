import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, type TemplateRef, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { type ZardSheetRef } from './sheet-ref';
import { ZardSheetService } from './sheet.service';
import { ZardButtonComponent } from '../button/button.component';

/** Default exit animation (200ms) plus a small margin, so the overlay is fully disposed. */
const CLOSE_DELAY = 250;

@Component({
  imports: [ZardButtonComponent],
  standalone: true,
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
})
class SheetTestHostComponent {
  private sheetService = inject(ZardSheetService);

  @ViewChild('testTemplate', { static: true }) testTemplate!: TemplateRef<void>;
  lastSheetRef?: ZardSheetRef<void>;

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
      imports: [SheetTestHostComponent],
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

  /** Opens a sheet straight from the service and waits for the overlay bindings to settle. */
  async function createSheet(config: Parameters<ZardSheetService['create']>[0]) {
    const ref = sheetService.create(config);
    fixture.detectChanges();
    await fixture.whenStable();
    return ref;
  }

  describe('Basic functionality', () => {
    it('should create a sheet when the button is clicked', () => {
      openSheet();

      const sheetElement = document.querySelector('z-sheet');
      if (isPlatformBrowser(platformId)) {
        expect(sheetElement).toBeTruthy();
        expect(sheetElement?.getAttribute('data-slot')).toBe('sheet-content');
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

    it('should render the close button with an accessible label', () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) return;

      const closeButton = document.querySelector('[data-testid="z-close-header-button"]');
      expect(closeButton).toBeTruthy();
      expect(closeButton?.getAttribute('data-slot')).toBe('sheet-close');
      expect(closeButton?.querySelector('.sr-only')?.textContent).toContain('Close');
    });

    it('should open without content when zContent is omitted', async () => {
      const ref = await createSheet({ zTitle: 'No content', zDescription: 'Header only' });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet');
      expect(sheetElement).toBeTruthy();
      expect(sheetElement?.querySelector('[data-slot="sheet-title"]')?.textContent).toContain('No content');
      expect(sheetElement?.querySelector('[data-testid="z-content"]')).toBeNull();
      expect(ref.componentInstance()).toBeNull();
    });

    it('should hide the close button when zClosable is false', async () => {
      await createSheet({
        zTitle: 'Not closable',
        zContent: 'content',
        zClosable: false,
      });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet');
      expect(sheetElement).toBeTruthy();
      expect(sheetElement?.querySelector('[data-testid="z-close-header-button"]')).toBeNull();
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

        await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
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

        await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
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

        await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
        expect(document.querySelector('z-sheet')).toBeNull();
      }
    });

    it('should add the leave class while closing', async () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      component.lastSheetRef?.close();
      fixture.detectChanges();

      expect(sheetElement.classList.contains('sheet-leave')).toBe(true);

      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
      expect(document.querySelector('z-sheet')).toBeNull();
    });

    it('should prevent multiple close() calls from queuing duplicate disposals', async () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) return;

      const closeButton = document.querySelector<HTMLButtonElement>('[data-testid="z-close-header-button"]');
      closeButton?.click();
      closeButton?.click();
      closeButton?.click();
      fixture.detectChanges();

      await new Promise(resolve => setTimeout(resolve, CLOSE_DELAY));
      expect(document.querySelector('z-sheet')).toBeNull();
    });
  });

  describe('Sheet variants', () => {
    it('should create a sheet with right side variant', () => {
      openSheetByIndex(2); // Right side sheet button

      if (isPlatformBrowser(platformId)) {
        const sheetElement = document.querySelector('z-sheet');
        expect(sheetElement).toBeTruthy();
        expect(sheetElement?.getAttribute('data-side')).toBe('right');
        expect(sheetElement?.classList.contains('right-0')).toBeTruthy();
        expect(sheetElement?.classList.contains('border-l')).toBeTruthy();
      }
    });

    it('should default to the right side when zSide is omitted', () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet');
      expect(sheetElement?.getAttribute('data-side')).toBe('right');
      expect(sheetElement?.classList.contains('right-0')).toBeTruthy();
      expect(sheetElement?.classList.contains('border-l')).toBeTruthy();
    });

    it.each([
      ['top', ['top-0', 'inset-x-0', 'border-b']],
      ['right', ['right-0', 'inset-y-0', 'border-l']],
      ['bottom', ['bottom-0', 'inset-x-0', 'border-t']],
      ['left', ['left-0', 'inset-y-0', 'border-r']],
    ] as const)('should apply the positioning classes for zSide "%s"', async (side, expectedClasses) => {
      await createSheet({ zTitle: `Sheet ${side}`, zContent: 'content', zSide: side });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      expect(sheetElement.getAttribute('data-side')).toBe(side);
      for (const expectedClass of expectedClasses) {
        expect(sheetElement.classList.contains(expectedClass)).toBe(true);
      }
    });

    it('should apply the small size classes on a left sheet', async () => {
      await createSheet({ zTitle: 'Small', zContent: 'content', zSide: 'left', zSize: 'sm' });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      // twMerge keeps the compound width and drops the base `w-3/4`.
      expect(sheetElement.classList.contains('w-1/2')).toBe(true);
      expect(sheetElement.classList.contains('w-3/4')).toBe(false);
      expect(sheetElement.classList.contains('sm:max-w-xs')).toBe(true);
    });

    it('should apply the large size classes on a top sheet', async () => {
      await createSheet({ zTitle: 'Large', zContent: 'content', zSide: 'top', zSize: 'lg' });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      expect(sheetElement.classList.contains('h-3/4')).toBe(true);
      expect(sheetElement.classList.contains('h-auto')).toBe(false);
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

    it('should disable the ok button when zOkDisabled is true', async () => {
      await createSheet({ zTitle: 'Disabled', zContent: 'content', zOkDisabled: true });

      if (!isPlatformBrowser(platformId)) return;

      const okButton = document.querySelector<HTMLButtonElement>('[data-testid="z-ok-button"]');
      expect(okButton).toBeTruthy();
      expect(okButton?.hasAttribute('disabled')).toBe(true);
      expect(okButton?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should apply custom classes on top of the variant classes', async () => {
      await createSheet({ zTitle: 'Custom', zContent: 'content', zCustomClasses: ['gap-8', 'p-2'] });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      expect(sheetElement.classList.contains('gap-8')).toBe(true);
      expect(sheetElement.classList.contains('p-2')).toBe(true);
      expect(sheetElement.classList.contains('gap-4')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should expose role=dialog and aria-modal on the host', () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      expect(sheetElement).toBeTruthy();
      expect(sheetElement.getAttribute('role')).toBe('dialog');
      expect(sheetElement.getAttribute('aria-modal')).toBe('true');
    });

    it('should link aria-labelledby to the title and aria-describedby to the description', () => {
      openSheet();

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      const labelledBy = sheetElement.getAttribute('aria-labelledby');
      const describedBy = sheetElement.getAttribute('aria-describedby');

      expect(labelledBy).toBeTruthy();
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)?.textContent).toContain('Test Sheet');
      expect(document.getElementById(describedBy!)?.textContent).toContain('This is a test sheet.');
    });

    it('should omit aria-labelledby and aria-describedby when there is no title or description', async () => {
      await createSheet({ zContent: 'content only' });

      if (!isPlatformBrowser(platformId)) return;

      const sheetElement = document.querySelector('z-sheet') as HTMLElement;
      expect(sheetElement.getAttribute('aria-labelledby')).toBeNull();
      expect(sheetElement.getAttribute('aria-describedby')).toBeNull();
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
