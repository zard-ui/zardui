import { Component, viewChild, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownDirective } from './dropdown-trigger.directive';
import { ZardDropdownService } from './dropdown.service';

@Component({
  imports: [ZardDropdownDirective, ZardDropdownMenuContentComponent],
  template: `
    <button
      type="button"
      z-dropdown
      [zDropdownMenu]="menuContent"
      [zTrigger]="triggerMode"
      [zDisabled]="disabled"
      aria-label="Open menu"
      data-testid="dropdown-trigger"
    >
      Menu
    </button>

    <z-dropdown-menu-content #menuContent>
      <div>Menu Item 1</div>
      <div>Menu Item 2</div>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  triggerMode: 'click' | 'hover' = 'click';
  disabled = false;
  readonly menuContent = viewChild.required<ZardDropdownMenuContentComponent>('menuContent');
}

describe('ZardDropdownDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownService: jest.Mocked<ZardDropdownService>;
  let mockIsOpenFn: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockIsOpenFn = jest.fn().mockReturnValue(false);

    const mockDropdownService = {
      isOpen: mockIsOpenFn,
      toggle: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<ZardDropdownService>;

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
        {
          provide: ZardDropdownService,
          useValue: mockDropdownService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dropdownService = TestBed.inject(ZardDropdownService) as jest.Mocked<ZardDropdownService>;
    fixture.detectChanges();
  });

  describe('Accessibility attributes', () => {
    it('sets tabindex role aria-haspopup and aria-expanded', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');

      expect(triggerElement).toHaveAttribute('tabindex', '0');
      expect(triggerElement).toHaveAttribute('role', 'button');
      expect(triggerElement).toHaveAttribute('aria-haspopup', 'menu');
      expect(triggerElement).toHaveAttribute('aria-expanded', 'false');
    });

    it('reflects disabled state in aria-disabled', () => {
      expect(component.disabled).toBe(false);

      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      expect(triggerElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('uses aria-label from host attribute', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');

      expect(triggerElement).toHaveAttribute('aria-label', 'Open menu');
    });
  });

  describe('Click trigger mode', () => {
    it('calls toggle on click event', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.click();

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('ignores clicks when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.click();

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });
  });

  describe('Hover trigger mode', () => {
    beforeEach(() => {
      component.triggerMode = 'hover';
      fixture.detectChanges();
    });

    it('calls openDropdown on mouseenter event', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('does not call openDropdown on mouseenter when already open', () => {
      mockIsOpenFn.mockReturnValue(true);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });

    it('calls closeDropdown on mouseleave event', () => {
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      expect(dropdownService.close).toHaveBeenCalled();
    });

    it('ignores hover events when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard navigation', () => {
    it('opens dropdown on Enter keydown', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('opens dropdown on Space keydown', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('opens dropdown on ArrowDown keydown', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('ignores keyboard events when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(dropdownService.toggle).not.toHaveBeenCalled();
    });

    it('toggles dropdown on Enter when already open', () => {
      mockIsOpenFn.mockReturnValue(true);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });

    it('toggles dropdown on Space when already open', () => {
      mockIsOpenFn.mockReturnValue(true);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(dropdownService.toggle).toHaveBeenCalled();
    });
  });

  describe('Service integration', () => {
    it('passes correct parameters to toggle method', () => {
      mockIsOpenFn.mockReturnValue(false);
      const triggerElement = fixture.nativeElement.querySelector('button');
      triggerElement.click();

      expect(dropdownService.toggle).toHaveBeenCalledWith(
        expect.any(ElementRef),
        expect.any(TemplateRef),
        expect.any(ViewContainerRef),
      );
    });
  });

  describe('Directive export', () => {
    it('exports as zDropdown', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      expect(directiveInstance).toBeTruthy();
      expect(directiveInstance).toBeInstanceOf(ZardDropdownDirective);
    });
  });

  describe('Input bindings', () => {
    it('receives zDropdownMenu input correctly', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      expect(directiveInstance.zDropdownMenu()).toBeTruthy();
    });

    it('accepts click and hover trigger modes', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      component.triggerMode = 'click';
      fixture.detectChanges();
      expect(directiveInstance.zTrigger()).toBe('click');

      component.triggerMode = 'hover';
      fixture.detectChanges();
      expect(directiveInstance.zTrigger()).toBe('hover');
    });

    it('accepts boolean for disabled state', () => {
      const directiveElement = fixture.debugElement.children[0];
      const directiveInstance = directiveElement.injector.get(ZardDropdownDirective);

      component.disabled = false;
      fixture.detectChanges();
      expect(directiveInstance.zDisabled()).toBe(false);

      component.disabled = true;
      fixture.detectChanges();
      expect(directiveInstance.zDisabled()).toBe(true);
    });
  });
});
