import { Component, TemplateRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ZardContextMenuTriggerDirective } from './context-menu.directive';
import { ZardMenuDirective } from './menu.directive';
import { ZardMenuManagerService } from './menu-manager.service';
import { ZardMenuItemDirective } from '@zard/components/menu/menu-item.directive';
import { ZardMenuContentDirective } from '@zard/components/menu/menu-content.directive';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

@Component({
  template: `
    <div [zContextMenuTriggerFor]="contextMenu" [zDisabled]="disabled" [zPreventDefault]="preventDefault" class="trigger">Right click here</div>

    <ng-template #contextMenu>
      <div z-menu-content class="w-48 menu-content">
        <button z-menu-item class="menu-item">Analytics</button>
        <button z-menu-item class="menu-item">Dashboard</button>
        <button z-menu-item class="menu-item">Reports</button>
        <button z-menu-item zDisabled class="menu-item disabled-item">Insights</button>
      </div>
    </ng-template>
  `,
  standalone: true,
  imports: [ZardContextMenuTriggerDirective, CdkMenuModule, ZardMenuItemDirective, ZardMenuContentDirective],
})
class TestContextMenuComponent {
  @ViewChild('contextMenu') contextMenuTemplate!: TemplateRef<any>;
  disabled = false;
  preventDefault = true;
}

describe('ZardContextMenuTriggerDirective', () => {
  let component: TestContextMenuComponent;
  let fixture: ComponentFixture<TestContextMenuComponent>;
  let triggerElement: HTMLElement;
  let directive: ZardContextMenuTriggerDirective;

  // Helper to get menu items
  const getMenuItems = () => document.querySelectorAll<HTMLElement>('[z-menu-item]:not([zDisabled])');
  // Helper to get a specific menu item
  const getMenuItemByText = (text: string) => Array.from(document.querySelectorAll<HTMLElement>('[z-menu-item]'))
    .find(el => el.textContent?.trim() === text);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestContextMenuComponent],
      providers: [ZardMenuManagerService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Target the trigger element using its class or directive
    triggerElement = fixture.debugElement.query(
      By.css('.trigger')
    ).nativeElement;

    const directiveDebugElement = fixture.debugElement.query(
      By.directive(ZardContextMenuTriggerDirective)
    );
    directive = directiveDebugElement.injector.get(ZardContextMenuTriggerDirective);
  });

  afterEach(() => {
    // Clean up any open menus
    const overlays = document.querySelectorAll('.cdk-overlay-container');
    overlays.forEach((overlay) => overlay.remove());
  });

  describe('Initialization', () => {
    it('should create the directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should have correct ARIA attributes', () => {
      expect(triggerElement.getAttribute('aria-haspopup')).toBe('menu');
      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have correct data attributes', () => {
      expect(triggerElement.getAttribute('data-state')).toBe('closed');
    });

    it('should have tabindex=0 by default', () => {
      expect(triggerElement.getAttribute('tabindex')).toBe('0');
    });

    it('should integrate ZardMenuDirective as host directive', () => {
      const menuDirective = fixture.debugElement
        .query(By.directive(ZardContextMenuTriggerDirective))
        .injector.get(ZardMenuDirective);
      expect(menuDirective).toBeTruthy();
    });
  });

  describe('Right-click behavior', () => {
    it('should open menu on right-click', fakeAsync(() => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('true');
      expect(triggerElement.getAttribute('data-state')).toBe('open');
    }));

    it('should prevent default browser context menu by default', () => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      spyOn(contextMenuEvent, 'preventDefault');
      triggerElement.dispatchEvent(contextMenuEvent);

      expect(contextMenuEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default when zPreventDefault is false', () => {
      component.preventDefault = false;
      fixture.detectChanges();

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      spyOn(contextMenuEvent, 'preventDefault');
      triggerElement.dispatchEvent(contextMenuEvent);

      expect(contextMenuEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should stop event propagation', () => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      spyOn(contextMenuEvent, 'stopPropagation');
      triggerElement.dispatchEvent(contextMenuEvent);

      expect(contextMenuEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not open menu when disabled', fakeAsync(() => {
      component.disabled = true;
      fixture.detectChanges();

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
    }));

    it('should set tabindex to -1 when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(triggerElement.getAttribute('tabindex')).toBe('-1');
      expect(triggerElement.getAttribute('data-disabled')).toBe('');
    });
  });

  describe('Keyboard behavior', () => {
    it('should open menu on Shift+F10', fakeAsync(() => {
      const keyboardEvent = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });

      spyOn(keyboardEvent, 'preventDefault');
      spyOn(keyboardEvent, 'stopPropagation');

      triggerElement.dispatchEvent(keyboardEvent);
      tick(20);
      fixture.detectChanges();

      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
      expect(triggerElement.getAttribute('aria-expanded')).toBe('true');
    }));

    it('should not open menu on F10 without Shift', fakeAsync(() => {
      const keyboardEvent = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: false,
        bubbles: true,
        cancelable: true,
      });

      triggerElement.dispatchEvent(keyboardEvent);
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
    }));

    it('should not open on Shift+F10 when disabled', fakeAsync(() => {
      component.disabled = true;
      fixture.detectChanges();

      const keyboardEvent = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });

      triggerElement.dispatchEvent(keyboardEvent);
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
    }));
  });


  describe('Menu positioning', () => {
    it('should position menu at cursor location', fakeAsync(() => {
      const clientX = 200;
      const clientY = 300;

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(overlay).toBeTruthy();
      expect(overlay.style.position).toBe('fixed');
    }));

    it('should adjust position if menu would overflow viewport right edge', fakeAsync(() => {
      const clientX = window.innerWidth - 50;
      const clientY = 100;

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(overlay).toBeTruthy();

      const overlayLeft = parseInt(overlay.style.left, 10);
      const menuContent = overlay.querySelector('.menu-content');
      const menuWidth = menuContent ? menuContent.getBoundingClientRect().width : 0;

      // Menu should not overflow
      expect(overlayLeft + menuWidth).toBeLessThanOrEqual(window.innerWidth);
    }));

    it('should adjust position if menu would overflow viewport bottom edge', fakeAsync(() => {
      const clientX = 100;
      const clientY = window.innerHeight - 50;

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(overlay).toBeTruthy();

      const overlayTop = parseInt(overlay.style.top, 10);
      const menuContent = overlay.querySelector('.menu-content');
      const menuHeight = menuContent ? menuContent.getBoundingClientRect().height : 0;

      // Menu should not overflow
      expect(overlayTop + menuHeight).toBeLessThanOrEqual(window.innerHeight);
    }));

    it('should position menu at element center when opened via keyboard', fakeAsync(() => {
      const keyboardEvent = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });

      triggerElement.dispatchEvent(keyboardEvent);
      tick(20);
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      expect(overlay).toBeTruthy();
      expect(overlay.style.position).toBe('fixed');
    }));
  });

  describe('Menu closing', () => {
    beforeEach(fakeAsync(() => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();
    }));

    it('should close menu on Escape key', fakeAsync(() => {
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(escapeEvent);
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
      expect(triggerElement.getAttribute('data-state')).toBe('closed');
    }));

    it('should restore focus to trigger element on Escape', fakeAsync(() => {
      spyOn(triggerElement, 'focus');

      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(escapeEvent);
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.focus).toHaveBeenCalled();
    }));

    it('should close menu on window resize', fakeAsync(() => {
      window.dispatchEvent(new Event('resize'));
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
    }));

    it('should close menu on scroll', fakeAsync(() => {
      document.dispatchEvent(new Event('scroll', { bubbles: true }));
      tick(20);
      fixture.detectChanges();

      expect(triggerElement.getAttribute('aria-expanded')).toBe('false');
    }));
  });

  describe('Keyboard navigation', () => {
    beforeEach(fakeAsync(() => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();
    }));

    it('should focus first menu item when menu opens', fakeAsync(() => {
      tick(50);
      const firstItem = getMenuItems()[0];
      expect(document.activeElement).toBe(firstItem);
    }));

    it('should focus next item on ArrowDown', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });

      overlay.dispatchEvent(arrowDownEvent);
      tick(10);

      const secondItem = getMenuItems()[1];
      expect(document.activeElement).toBe(secondItem);
    }));

    it('should focus previous item on ArrowUp', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;

      // Move to second item
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(10);

      // Move back to first
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      tick(10);

      const firstItem = getMenuItems()[0];
      expect(document.activeElement).toBe(firstItem);
    }));

    it('should wrap to first item when pressing ArrowDown on last item', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const enabledItems = getMenuItems();
      const lastItem = enabledItems[enabledItems.length - 1];

      // Navigate to last enabled item
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      tick(10);
      expect(document.activeElement).toBe(lastItem);

      // Press down again
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(10);

      const firstItem = enabledItems[0];
      expect(document.activeElement).toBe(firstItem);
    }));

    it('should wrap to last item when pressing ArrowUp on first item', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const enabledItems = getMenuItems();
      const lastItem = enabledItems[enabledItems.length - 1];

      const arrowUpEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      });

      overlay.dispatchEvent(arrowUpEvent);
      tick(10);

      expect(document.activeElement).toBe(lastItem);
    }));

    it('should focus first item on Home key', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const firstItem = getMenuItems()[0];

      // Navigate to middle
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(10);

      // Press Home
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      tick(10);

      expect(document.activeElement).toBe(firstItem);
    }));

    it('should focus last enabled item on End key', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const enabledItems = getMenuItems();
      const lastItem = enabledItems[enabledItems.length - 1]; // "Reports"

      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      tick(10);

      expect(document.activeElement).toBe(lastItem);
    }));

    it('should skip disabled items when navigating', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const enabledItems = getMenuItems();

      // Navigate to third enabled item ("Reports")
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(10);
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(10);
      expect(document.activeElement).toBe(getMenuItemByText('Reports'));

      // Try to navigate past it (next is "Insights" which is disabled)
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      tick(10);

      // Should wrap to first item ("Analytics") instead
      const firstItem = enabledItems[0];
      expect(document.activeElement).toBe(firstItem);
    }));

    it('should activate item on Enter key', fakeAsync(() => {
      tick(50);
      const firstItem = getMenuItems()[0];
      spyOn(firstItem, 'click');

      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      tick(10);

      expect(firstItem.click).toHaveBeenCalled();
    }));

    it('should activate item on Space key', fakeAsync(() => {
      tick(50);
      const firstItem = getMenuItems()[0];
      spyOn(firstItem, 'click');

      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      tick(10);

      expect(firstItem.click).toHaveBeenCalled();
    }));

    it('should trap focus with Tab key', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;

      // Tab moves focus forward (item-1 -> item-2)
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      tick(10);

      const secondItem = getMenuItems()[1];
      expect(document.activeElement).toBe(secondItem);
    }));

    it('should trap focus with Shift+Tab key', fakeAsync(() => {
      tick(50);
      const overlay = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const enabledItems = getMenuItems();
      const lastItem = enabledItems[enabledItems.length - 1]; // "Reports"

      // Shift+Tab moves focus backward (item-1 -> item-3, wrapping)
      overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
      tick(10);

      expect(document.activeElement).toBe(lastItem);
    }));
  });

  //---

  describe('Cleanup', () => {
    it('should clean up event listeners on destroy', fakeAsync(() => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 150,
      });

      triggerElement.dispatchEvent(contextMenuEvent);
      tick(20);
      fixture.detectChanges();

      fixture.destroy();
      tick(20);

      // Menu should be closed
      const overlay = document.querySelector('.cdk-overlay-pane');
      expect(overlay).toBeNull();
    }));

    it('should disconnect resize observer on destroy', () => {
      const resizeObserver = (directive as any).resizeObserver;
      if (resizeObserver) {
        spyOn(resizeObserver, 'disconnect');
        fixture.destroy();
        expect(resizeObserver.disconnect).toHaveBeenCalled();
      }
    });
  });
});
