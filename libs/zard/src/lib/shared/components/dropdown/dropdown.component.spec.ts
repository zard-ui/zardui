import { OverlayModule } from '@angular/cdk/overlay';
import { Component, type DebugElement } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core';

import { ZardDropdownMenuComponent } from './dropdown.component';

@Component({
  imports: [ZardDropdownMenuComponent],
  template: `
    <z-dropdown-menu [disabled]="disabled" [class]="customClass">
      <div dropdown-trigger>Trigger</div>
      <div z-dropdown-menu-item>Item 1</div>
      <div z-dropdown-menu-item>Item 2</div>
    </z-dropdown-menu>
  `,
})
class TestComponent {
  disabled = false;
  customClass = '';
}

@Component({
  imports: [ZardDropdownMenuComponent],
  template: `
    <z-dropdown-menu (openChange)="onOpenChange($event)">
      <div dropdown-trigger>Trigger</div>
      <div z-dropdown-menu-item>Item 1</div>
      <div z-dropdown-menu-item>Item 2</div>
    </z-dropdown-menu>
  `,
})
class OpenChangeOutputTestComponent {
  openChangeEmitted = false;
  lastOpenState = false;

  onOpenChange(isOpen: boolean) {
    this.openChangeEmitted = true;
    this.lastOpenState = isOpen;
  }
}

@Component({
  imports: [ZardDropdownMenuComponent],
  template: `
    <z-dropdown-menu #dropdown="zDropdownMenu">
      <div dropdown-trigger>Trigger</div>
      <div z-dropdown-menu-item>Item 1</div>
      <div z-dropdown-menu-item>Item 2</div>
    </z-dropdown-menu>
  `,
})
class TemplateRefTestComponent {}

function configureDropdownTestBed() {
  return TestBed.configureTestingModule({
    imports: [OverlayModule],
    providers: [
      {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: ZardEventManagerPlugin,
        multi: true,
      },
    ],
  }).compileComponents();
}

function cleanupOverlay() {
  const overlayContainer = document.querySelector('.cdk-overlay-container');
  if (overlayContainer) {
    overlayContainer.innerHTML = '';
  }
}

describe('ZardDropdownMenuComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownEl: DebugElement;

  beforeEach(async () => {
    await configureDropdownTestBed();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dropdownEl = fixture.debugElement.query(By.css('z-dropdown-menu'));
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupOverlay();
  });

  describe('Initialization', () => {
    it('initializes component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('sets correct host classes', () => {
      const hostElement = dropdownEl.nativeElement;
      expect(hostElement).toHaveClass('relative', 'inline-block', 'text-left');
    });

    it('sets initial data-state to closed', () => {
      const hostElement = dropdownEl.nativeElement;
      expect(hostElement.getAttribute('data-state')).toBe('closed');
    });

    it('renders trigger container', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      expect(trigger).toBeTruthy();
    });

    it('renders dropdown trigger content', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      expect(trigger.textContent).toContain('Trigger');
    });
  });

  describe('Toggle functionality', () => {
    it('opens dropdown on trigger click', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);
      expect(dropdownEl.nativeElement.getAttribute('data-state')).toBe('open');
    });

    it('closes dropdown when clicking trigger again', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
      expect(dropdownEl.nativeElement.getAttribute('data-state')).toBe('closed');
    });

    it('can be toggled programmatically', () => {
      dropdownEl.componentInstance.open();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);

      dropdownEl.componentInstance.close();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('Disabled state', () => {
    it('does not open when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });

    it('does not open on Enter key when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });

    it('toggles dropdown on Enter key when not disabled', () => {
      component.disabled = false;
      fixture.detectChanges();

      const toggleSpy = jest.spyOn(dropdownEl.componentInstance, 'toggle');
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('toggles dropdown on Space key when not disabled', () => {
      component.disabled = false;
      fixture.detectChanges();

      const toggleSpy = jest.spyOn(dropdownEl.componentInstance, 'toggle');
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('Document click to close', () => {
    it('closes dropdown when clicking outside', () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);

      document.body.click();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('Custom classes', () => {
    it('applies custom class to dropdown content', async () => {
      component.customClass = 'custom-dropdown';
      fixture.detectChanges();

      const dropdownMenu = dropdownEl.componentInstance;
      expect(dropdownMenu.class()).toBe('custom-dropdown');

      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const overlayContent = overlayContainer?.querySelector('[role="menu"]');
      expect(overlayContent?.classList).toContain('custom-dropdown');
    });
  });

  describe('Keyboard navigation within dropdown', () => {
    it('has role="menu" on dropdown content', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');

      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
    });

    it('moves focus to next item with ArrowDown', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[1]?.hasAttribute('data-highlighted')).toBe(true);
    });

    it('moves focus to previous item with ArrowUp', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[0]?.hasAttribute('data-highlighted')).toBe(true);
    });

    it('closes dropdown with Escape key', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(true);

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(dropdownEl.componentInstance.isOpen()).toBe(false);
    });

    it('focuses first item with Home key', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[0]?.hasAttribute('data-highlighted')).toBe(true);
    });

    it('focuses last item with End key', async () => {
      const trigger = fixture.nativeElement.querySelector('.trigger-container');
      trigger.click();
      await new Promise(resolve => setTimeout(resolve, 10));
      fixture.detectChanges();

      const overlayContainer = document.querySelector('.cdk-overlay-container');
      const menuElement = overlayContainer?.querySelector('[role="menu"]');
      expect(menuElement).toBeTruthy();
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      menuElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      const menuItems = overlayContainer?.querySelectorAll<HTMLElement>('[z-dropdown-menu-item]');
      expect(menuItems?.[menuItems.length - 1]?.hasAttribute('data-highlighted')).toBe(true);
    });
  });

  describe('Lifecycle hooks', () => {
    it('initializes with closed state', async () => {
      const dropdownMenu = dropdownEl.componentInstance;

      await fixture.whenStable();
      fixture.detectChanges();

      expect(dropdownMenu.isOpen()).toBe(false);
    });
  });
});

describe('ZardDropdownMenuComponent with openChange output', () => {
  let fixture: ComponentFixture<OpenChangeOutputTestComponent>;

  beforeEach(async () => {
    await configureDropdownTestBed();

    fixture = TestBed.createComponent(OpenChangeOutputTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupOverlay();
  });

  it('emits true when dropdown opens', () => {
    const trigger = fixture.nativeElement.querySelector('.trigger-container');

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.openChangeEmitted).toBe(true);
    expect(fixture.componentInstance.lastOpenState).toBe(true);
  });

  it('emits false when dropdown closes', () => {
    const trigger = fixture.nativeElement.querySelector('.trigger-container');

    trigger.click();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.openChangeEmitted).toBe(true);
    expect(fixture.componentInstance.lastOpenState).toBe(false);
  });
});

describe('ZardDropdownMenuComponent via TestComponent host', () => {
  let dropdownMenu: ZardDropdownMenuComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dropdownEl: DebugElement;

  beforeEach(async () => {
    await configureDropdownTestBed();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    dropdownEl = fixture.debugElement.query(By.css('z-dropdown-menu'));
    dropdownMenu = dropdownEl.componentInstance as ZardDropdownMenuComponent;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupOverlay();
  });

  it('exports as zDropdownMenu', () => {
    const templateRefFixture = TestBed.createComponent(TemplateRefTestComponent);
    templateRefFixture.detectChanges();

    const templateDropdownEl = templateRefFixture.debugElement.query(By.css('z-dropdown-menu'));
    const templateRef = templateDropdownEl.references['dropdown'] as ZardDropdownMenuComponent;
    const templateRefComponent = templateDropdownEl.componentInstance as ZardDropdownMenuComponent;

    expect(templateRef).toBe(templateRefComponent);
    expect(templateRef).toBeInstanceOf(ZardDropdownMenuComponent);
  });

  it('applies custom class input', () => {
    testComponent.customClass = 'custom-class';
    fixture.detectChanges();

    expect(dropdownMenu.class()).toBe('custom-class');
  });

  it('sets disabled input', () => {
    testComponent.disabled = true;
    fixture.detectChanges();

    expect(dropdownMenu.disabled()).toBe(true);
  });

  it('toggles open state with open method', () => {
    dropdownMenu.open();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(true);

    dropdownMenu.close();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(false);
  });

  it('toggles with toggle method', () => {
    dropdownMenu.toggle();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(true);

    dropdownMenu.toggle();
    fixture.detectChanges();

    expect(dropdownMenu.isOpen()).toBe(false);
  });
});
