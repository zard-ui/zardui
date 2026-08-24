import { PARENT_OR_NEW_MENU_STACK_PROVIDER } from '@angular/cdk/menu';
import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardNavigationMenuLinkDirective } from './navigation-menu-link.directive';

@Component({
  imports: [ZardNavigationMenuLinkDirective],
  template: `
    <button type="button" z-navigation-menu-link [zDisabled]="disabled" [zInset]="inset" [class]="customClass">
      Menu Item
    </button>
  `,
})
class TestComponent {
  disabled = false;
  inset: boolean | undefined = false;
  customClass = '';
}

describe('ZardNavigationMenuLinkDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardNavigationMenuLinkDirective;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [PARENT_OR_NEW_MENU_STACK_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    const directiveDebugElement = fixture.debugElement.query(By.directive(ZardNavigationMenuLinkDirective));
    directive = directiveDebugElement.injector.get(ZardNavigationMenuLinkDirective);
    element = directiveDebugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should have correct initial attributes', () => {
    expect(element.getAttribute('tabindex')).toBe('0');
    expect(element.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should not claim the menuitem role outside a menu', () => {
    // `role="menuitem"` without a menu, menubar or group parent is an `aria-required-parent`
    // violation, which is what a link declared straight on the bar would be.
    expect(element.getAttribute('role')).toBeNull();
  });

  it('should reflect disabled state', () => {
    expect(element.getAttribute('data-disabled')).toBeNull();
    expect(element.getAttribute('aria-disabled')).toBeNull();

    component.disabled = true;
    fixture.detectChanges();

    expect(element.getAttribute('data-disabled')).toBe('');
    expect(element.getAttribute('aria-disabled')).toBe('');
  });

  it('should apply default menu item classes', () => {
    expect(element.className).toContain('relative');
    expect(element.className).toContain('flex');
    expect(element.className).toContain('cursor-default');
    expect(element.className).toContain('select-none');
  });

  it('should apply inset classes when inset is true', () => {
    component.inset = true;
    fixture.detectChanges();

    expect(element.className).toContain('pl-8');
  });

  it('should not apply inset classes when inset is false', () => {
    component.inset = false;
    fixture.detectChanges();

    expect(element.className).not.toContain('pl-8');
  });

  it('should merge custom classes', () => {
    component.customClass = 'custom-class';
    fixture.detectChanges();

    expect(element.className).toContain('custom-class');
    expect(element.className).toContain('relative');
  });

  it('should set focused state on focus', () => {
    expect(directive['isFocused']()).toBe(false);

    element.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(directive['isFocused']()).toBe(true);
    expect(element.getAttribute('data-highlighted')).toBe('');
  });

  it('should clear focused state on blur', () => {
    directive['isFocused'].set(true);
    fixture.detectChanges();

    element.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(directive['isFocused']()).toBe(false);
    expect(element.getAttribute('data-highlighted')).toBeNull();
  });

  it('should not focus when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    element.dispatchEvent(new FocusEvent('focus'));

    expect(directive['isFocused']()).toBe(false);
  });

  it('should never move the focus with the pointer', () => {
    // Focusing on hover leaves `focus:bg-muted` and the focus ring behind on the last link the
    // pointer crossed, which reads as a hover state that will not go away.
    const focusSpy = jest.spyOn(element, 'focus');

    element.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse' }));
    element.dispatchEvent(new PointerEvent('pointerover', { pointerType: 'mouse' }));
    element.dispatchEvent(new MouseEvent('mouseenter'));
    element.dispatchEvent(new MouseEvent('mousemove'));

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should sync disabled state with CDK menu item', () => {
    const cdkMenuItem = directive['cdkMenuItem'];

    expect(cdkMenuItem.disabled).toBe(false);

    component.disabled = true;
    fixture.detectChanges();

    expect(cdkMenuItem.disabled).toBe(true);
  });
});
