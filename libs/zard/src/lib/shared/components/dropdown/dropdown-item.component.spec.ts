import { Component } from '@angular/core';
import { fakeAsync, flush, type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardDropdownMenuItemComponent } from './dropdown-item.component';
import { ZardDropdownService } from './dropdown.service';

@Component({
  imports: [ZardDropdownMenuItemComponent],
  template: `
    <z-dropdown-menu-item [variant]="variant" [inset]="inset" [disabled]="disabled">
      {{ text }}
    </z-dropdown-menu-item>
  `,
})
class TestComponent {
  variant: 'default' | 'destructive' = 'default';
  inset = false;
  disabled = false;
  text = 'Test Item';
}

describe('ZardDropdownMenuItemComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownService: jest.Mocked<ZardDropdownService>;

  beforeEach(async () => {
    const mockDropdownService = {
      close: jest.fn(),
      isOpen: jest.fn().mockReturnValue(false),
      toggle: jest.fn(),
    } as unknown as jest.Mocked<ZardDropdownService>;

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: ZardDropdownService,
          useValue: mockDropdownService,
        },
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dropdownService = TestBed.inject(ZardDropdownService) as jest.Mocked<ZardDropdownService>;
    fixture.detectChanges();

    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('sets menuitem role and tabindex', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');

      expect(itemElement).toBeTruthy();
      expect(itemElement).toHaveAttribute('role', 'menuitem');
      expect(itemElement).toHaveAttribute('tabindex', '-1');
    });

    it('displays text content', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');

      expect(itemElement.textContent).toContain('Test Item');
    });
  });

  describe('Disabled state', () => {
    it('sets data-disabled and aria-disabled when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-disabled');
      expect(itemElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set data-disabled when enabled', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).not.toHaveAttribute('data-disabled');
      expect(itemElement).toHaveAttribute('aria-disabled', 'false');
    });
  });

  describe('Variant attribute', () => {
    it('sets data-variant to default', () => {
      component.variant = 'default';
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-variant', 'default');
    });

    it('sets data-variant to destructive', () => {
      component.variant = 'destructive';
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-variant', 'destructive');
    });
  });

  describe('Inset attribute', () => {
    it('sets data-inset when inset is true', () => {
      component.inset = true;
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).toHaveAttribute('data-inset');
    });

    it('does not set data-inset when inset is false', () => {
      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(itemElement).not.toHaveAttribute('data-inset');
    });
  });

  describe('Click handling', () => {
    it('calls dropdownService.close() on click when enabled', fakeAsync(() => {
      const itemDebugElement = fixture.debugElement.children[0];
      const itemComponent = itemDebugElement.componentInstance as ZardDropdownMenuItemComponent;
      itemComponent.onClick();
      flush();

      expect(dropdownService.close).toHaveBeenCalled();
    }));

    it('does not call dropdownService.close() on click when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const itemDebugElement = fixture.debugElement.children[0];
      const itemComponent = itemDebugElement.componentInstance as ZardDropdownMenuItemComponent;
      itemComponent.onClick();

      expect(dropdownService.close).not.toHaveBeenCalled();
    });
  });

  describe('Styling classes', () => {
    it('applies destructive variant classes', () => {
      component.variant = 'destructive';
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(Array.from(itemElement.classList as DOMTokenList).some(c => c.includes('destruct'))).toBe(true);
    });

    it('applies inset padding classes when inset is true', () => {
      component.inset = true;
      fixture.detectChanges();

      const itemElement = fixture.nativeElement.querySelector('z-dropdown-menu-item');
      expect(
        Array.from(itemElement.classList as DOMTokenList).some(c => c.startsWith('pl-') || c.includes('inset')),
      ).toBe(true);
    });
  });
});

describe('ZardDropdownMenuItemComponent standalone', () => {
  let component: ZardDropdownMenuItemComponent;
  let fixture: ComponentFixture<ZardDropdownMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDropdownMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDropdownMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('applies custom class input', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element).toHaveClass('custom-class');
  });
});
