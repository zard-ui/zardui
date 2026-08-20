import '@testing-library/jest-dom';

import { Component, signal, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import type { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownImports } from './dropdown.imports';
import { ZardDropdownService } from './dropdown.service';

@Component({
  imports: [ZardDropdownImports],
  template: `
    <z-dropdown-menu-content #menu="zDropdownMenuContent">
      <z-dropdown-menu-item data-testid="copy">Copy</z-dropdown-menu-item>
      <z-dropdown-menu-sub-trigger [zSubMenu]="more" [zDisabled]="disabled()" data-testid="sub-trigger">
        More Tools
      </z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #more="zDropdownMenuSubContent">
        <z-dropdown-menu-item data-testid="save">Save Page...</z-dropdown-menu-item>
        <z-dropdown-menu-item data-testid="devtools">Developer Tools</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  readonly menu = viewChild.required<ZardDropdownMenuContentComponent>('menu');
  readonly disabled = signal(false);
}

describe('ZardDropdownMenuSubTriggerComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dropdown: ZardDropdownService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestComponent] }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    dropdown = TestBed.inject(ZardDropdownService);

    const menu = fixture.componentInstance.menu();
    dropdown.openAt({ x: 0, y: 0 }, menu.contentTemplate(), menu.viewContainerRef);
    fixture.detectChanges();
  });

  afterEach(() => {
    dropdown.close();
    fixture.destroy();
  });

  function subTrigger() {
    return document.querySelector<HTMLElement>('[data-testid="sub-trigger"]')!;
  }

  function subContent() {
    return document.querySelector<HTMLElement>('[data-slot="dropdown-menu-sub-content"]');
  }

  it('renders inside the open menu with submenu semantics', () => {
    const trigger = subTrigger();

    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('role')).toBe('menuitem');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('data-state')).toBe('closed');
    expect(subContent()).toBeNull();
  });

  it('opens the submenu on hover', () => {
    subTrigger().dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    fixture.detectChanges();

    expect(subContent()).not.toBeNull();
    expect(subTrigger().getAttribute('data-state')).toBe('open');
    expect(subTrigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('opens the submenu on click', () => {
    subTrigger().click();
    fixture.detectChanges();

    expect(subContent()).not.toBeNull();
  });

  it.each(['ArrowRight', 'Enter', ' '])('opens the submenu with the %s key', key => {
    subTrigger().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(subContent()).not.toBeNull();
  });

  it('renders the submenu rows on their own menu surface', () => {
    subTrigger().click();
    fixture.detectChanges();

    const content = subContent();
    expect(content?.getAttribute('role')).toBe('menu');
    expect(content?.querySelectorAll('[role="menuitem"]').length).toBe(2);
  });

  it('closes the submenu and returns the focus on ArrowLeft', () => {
    subTrigger().click();
    fixture.detectChanges();

    const focusSpy = jest.spyOn(subTrigger(), 'focus');
    subContent()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(subContent()).toBeNull();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('closes the submenu on Escape without closing the parent menu', () => {
    subTrigger().click();
    fixture.detectChanges();

    subContent()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(subContent()).toBeNull();
    expect(dropdown.isOpen()).toBe(true);
  });

  it('walks the submenu rows with the arrow keys', () => {
    subTrigger().click();
    fixture.detectChanges();

    const content = subContent()!;
    const arrow = (key: string) =>
      content.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

    arrow('ArrowDown');
    expect(document.querySelector('[data-testid="save"]')).toHaveAttribute('data-highlighted');

    arrow('ArrowDown');
    expect(document.querySelector('[data-testid="devtools"]')).toHaveAttribute('data-highlighted');
    expect(document.querySelector('[data-testid="save"]')).not.toHaveAttribute('data-highlighted');

    // Wraps back to the top rather than stopping at the last row.
    arrow('ArrowDown');
    expect(document.querySelector('[data-testid="save"]')).toHaveAttribute('data-highlighted');

    arrow('End');
    expect(document.querySelector('[data-testid="devtools"]')).toHaveAttribute('data-highlighted');

    arrow('Home');
    expect(document.querySelector('[data-testid="save"]')).toHaveAttribute('data-highlighted');
  });

  it('jumps to a submenu row by its first character', () => {
    subTrigger().click();
    fixture.detectChanges();

    subContent()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true, cancelable: true }));

    expect(document.querySelector('[data-testid="devtools"]')).toHaveAttribute('data-highlighted');
  });

  it('closes the submenu when the parent menu closes', () => {
    subTrigger().click();
    fixture.detectChanges();
    expect(subContent()).not.toBeNull();

    dropdown.close();
    fixture.detectChanges();

    expect(subContent()).toBeNull();
  });

  it('stays closed while disabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    subTrigger().click();
    subTrigger().dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    fixture.detectChanges();

    expect(subContent()).toBeNull();
    expect(subTrigger()).toHaveAttribute('data-disabled');
  });
});
