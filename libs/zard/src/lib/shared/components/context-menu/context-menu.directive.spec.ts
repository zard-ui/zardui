import '@testing-library/jest-dom';

import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardContextMenuImports } from './context-menu.imports';
import { ZardContextMenuService } from './context-menu.service';

@Component({
  imports: [ZardContextMenuImports],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      [zDisabled]="disabled()"
      (zVisibleChange)="visible.set($event)"
      data-testid="trigger"
    >
      Right click here
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent">
      <z-dropdown-menu-item data-testid="item">Back</z-dropdown-menu-item>
      <z-dropdown-menu-item zDisabled data-testid="disabled-item">Forward</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  readonly disabled = signal(false);
  readonly visible = signal<boolean | undefined>(undefined);
}

function rightClick(element: HTMLElement, x = 40, y = 60) {
  const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y });
  element.dispatchEvent(event);
  return event;
}

describe('ZardContextMenuDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let trigger: HTMLElement;
  let contextMenu: ZardContextMenuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestComponent] }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]');
    contextMenu = TestBed.inject(ZardContextMenuService);
  });

  afterEach(() => {
    contextMenu.close();
    fixture.destroy();
  });

  function openMenu() {
    return document.querySelector<HTMLElement>('[data-slot="dropdown-menu-content"]');
  }

  describe('initial state', () => {
    it('marks the area as a menu trigger', () => {
      expect(trigger.getAttribute('data-slot')).toBe('context-menu-trigger');
      expect(trigger.getAttribute('data-state')).toBe('closed');
      expect(trigger.getAttribute('tabindex')).toBe('0');
    });

    it('carries no ARIA of its own, which a generic element could not support', () => {
      expect(trigger.getAttribute('aria-haspopup')).toBeNull();
      expect(trigger.getAttribute('aria-expanded')).toBeNull();
    });

    it('renders no menu before the first right click', () => {
      expect(openMenu()).toBeNull();
    });
  });

  describe('opening', () => {
    it('opens the menu on right click and suppresses the native one', () => {
      const event = rightClick(trigger);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(openMenu()).not.toBeNull();
      expect(trigger.getAttribute('data-state')).toBe('open');
    });

    it('renders the menu rows with menu semantics', () => {
      rightClick(trigger);
      fixture.detectChanges();

      const menu = openMenu();
      expect(menu?.getAttribute('role')).toBe('menu');
      expect(menu?.getAttribute('aria-orientation')).toBe('vertical');
      expect(menu?.querySelectorAll('[role="menuitem"]').length).toBe(2);
      expect(menu?.querySelector('[data-testid="disabled-item"]')).toHaveAttribute('data-disabled');
    });

    it('reopens at the new pointer position on a second right click', () => {
      rightClick(trigger, 10, 10);
      fixture.detectChanges();
      rightClick(trigger, 300, 300);
      fixture.detectChanges();

      expect(document.querySelectorAll('[data-slot="dropdown-menu-content"]').length).toBe(1);
      expect(trigger.getAttribute('data-state')).toBe('open');
    });

    it('emits zVisibleChange when the menu opens and closes', () => {
      rightClick(trigger);
      fixture.detectChanges();
      expect(fixture.componentInstance.visible()).toBe(true);

      contextMenu.close();
      fixture.detectChanges();
      expect(fixture.componentInstance.visible()).toBe(false);
    });
  });

  describe('keyboard', () => {
    it.each(['ContextMenu', 'F10'])('opens with the %s key', key => {
      const event = new KeyboardEvent('keydown', { key, shiftKey: key === 'F10', bubbles: true, cancelable: true });
      trigger.dispatchEvent(event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
      expect(openMenu()).not.toBeNull();
    });

    it('ignores F10 without Shift and other keys', () => {
      for (const key of ['F10', 'Enter', 'a']) {
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      }
      fixture.detectChanges();

      expect(openMenu()).toBeNull();
    });
  });

  describe('zDisabled', () => {
    beforeEach(() => {
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();
    });

    it('leaves the native menu to the browser', () => {
      const event = rightClick(trigger);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(openMenu()).toBeNull();
      expect(trigger).toHaveAttribute('data-disabled');
    });

    it('drops out of the tab order', () => {
      expect(trigger.getAttribute('tabindex')).toBeNull();
    });

    it('ignores the keyboard shortcuts', () => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(openMenu()).toBeNull();
    });
  });
});
