import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardMenuItemDirective } from './menu-item.directive';

@Component({
  template: `<button z-menu-item [zDisabled]="disabled" [zInset]="inset" [class]="customClass">Menu Item</button>`,
  imports: [ZardMenuItemDirective],
})
class TestComponent {
  disabled = false;
  inset: boolean | undefined = false;
  customClass = '';
}

describe('ZardMenuItemDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardMenuItemDirective;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    const directiveDebugElement = fixture.debugElement.query(By.directive(ZardMenuItemDirective));
    directive = directiveDebugElement.injector.get(ZardMenuItemDirective);
    element = directiveDebugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should have correct initial attributes', () => {
    expect(element.getAttribute('role')).toBe('menuitem');
    expect(element.getAttribute('tabindex')).toBe('-1');
    expect(element.getAttribute('data-orientation')).toBe('horizontal');
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

    expect(directive['isFocused']()).toBe(true);
    expect(element.getAttribute('data-highlighted')).toBe('');
  });

  it('should clear focused state on blur', () => {
    directive['isFocused'].set(true);
    fixture.detectChanges();

    element.dispatchEvent(new FocusEvent('blur'));

    expect(directive['isFocused']()).toBe(false);
    expect(element.getAttribute('data-highlighted')).toBeNull();
  });

  it('should not focus when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    element.dispatchEvent(new FocusEvent('focus'));

    expect(directive['isFocused']()).toBe(false);
  });

  it('should handle pointer move events', () => {
    const focusSpy = jest.spyOn(element, 'focus');
    const pointerEvent = new PointerEvent('pointermove', { pointerType: 'mouse' });

    element.dispatchEvent(pointerEvent);

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('should not handle pointer move when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const focusSpy = jest.spyOn(element, 'focus');
    const pointerEvent = new PointerEvent('pointermove', { pointerType: 'mouse' });

    element.dispatchEvent(pointerEvent);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should ignore non-mouse pointer events', () => {
    const focusSpy = jest.spyOn(element, 'focus');
    const pointerEvent = new PointerEvent('pointermove', { pointerType: 'touch' });

    element.dispatchEvent(pointerEvent);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('should handle prevented default pointer events', () => {
    const focusSpy = jest.spyOn(element, 'focus');
    const pointerEvent = new PointerEvent('pointermove', { pointerType: 'mouse' });
    pointerEvent.preventDefault();

    element.dispatchEvent(pointerEvent);

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
