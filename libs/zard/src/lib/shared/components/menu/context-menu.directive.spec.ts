import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardContextMenuDirective } from './context-menu.directive';
import { ZardMenuContentDirective } from './menu-content.directive';

@Component({
  imports: [ZardContextMenuDirective, ZardMenuContentDirective],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="contextMenu"
      [zDisabled]="disabled"
      [zPlacement]="placement"
      class="test-area"
    >
      Right click here
    </div>

    <ng-template #contextMenu>
      <div z-menu-content class="w-48">
        <button type="button" z-menu-item (click)="log('Test')">Test Item</button>
      </div>
    </ng-template>
  `,
})
class TestComponent {
  disabled = false;
  placement = 'bottomRight';

  log(item: string) {
    console.log('Clicked:', item);
  }
}

describe('ZardContextMenuDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardContextMenuDirective;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    const directiveDebugElement = fixture.debugElement.query(By.directive(ZardContextMenuDirective));
    directive = directiveDebugElement.injector.get(ZardContextMenuDirective);
    element = directiveDebugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should have correct initial attributes', () => {
    expect(element.getAttribute('data-disabled')).toBeNull();
    expect(element.style.cursor).toBe('context-menu');
  });

  it('should reflect disabled state', () => {
    expect(element.getAttribute('data-disabled')).toBeNull();

    component.disabled = true;
    fixture.detectChanges();

    expect(element.getAttribute('data-disabled')).toBe('');
  });

  it('should have default placement', () => {
    expect(directive.zPlacement()).toBe('bottomRight');
  });

  it('should update placement when input changes', () => {
    component.placement = 'topLeft';
    fixture.detectChanges();

    expect(directive.zPlacement()).toBe('topLeft');
  });

  it('should prevent default context menu when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const preventDefaultSpy = jest.fn();
    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(contextMenuEvent, 'preventDefault', { value: preventDefaultSpy });

    element.dispatchEvent(contextMenuEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should handle keyboard events', () => {
    const preventDefaultSpy = jest.fn();
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'ContextMenu',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(keyboardEvent, 'preventDefault', { value: preventDefaultSpy });

    element.dispatchEvent(keyboardEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should handle Shift+F10 keyboard event', () => {
    const preventDefaultSpy = jest.fn();
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'F10',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(keyboardEvent, 'preventDefault', { value: preventDefaultSpy });

    element.dispatchEvent(keyboardEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not handle other keyboard events', () => {
    const preventDefaultSpy = jest.fn();
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(keyboardEvent, 'preventDefault', { value: preventDefaultSpy });

    element.dispatchEvent(keyboardEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should not handle keyboard events when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const preventDefaultSpy = jest.fn();
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'ContextMenu',
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(keyboardEvent, 'preventDefault', { value: preventDefaultSpy });

    element.dispatchEvent(keyboardEvent);

    expect(preventDefaultSpy).toHaveBeenCalled(); // Still prevent default but don't open menu
  });

  it('should provide open method', () => {
    expect(typeof directive.open).toBe('function');
  });

  it('should provide close method', () => {
    expect(typeof directive.close).toBe('function');
  });

  it('should open with custom coordinates', () => {
    const openSpy = jest.spyOn(directive['cdkTrigger'], 'open');
    const coordinates = { x: 100, y: 200 };

    directive.open(coordinates);

    expect(openSpy).toHaveBeenCalledWith(coordinates);
  });

  it('should open with default coordinates when none provided', () => {
    const openSpy = jest.spyOn(directive['cdkTrigger'], 'open');
    const getBoundingClientRectSpy = jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      left: 50,
      top: 60,
      width: 100,
      height: 20,
      right: 150,
      bottom: 80,
      x: 50,
      y: 60,
      toJSON: jest.fn(),
    });

    directive.open();

    expect(getBoundingClientRectSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith({ x: 100, y: 70 }); // center of element
  });

  it('should not open when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const openSpy = jest.spyOn(directive['cdkTrigger'], 'open');

    directive.open();

    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners on destroy', () => {
    const removeEventListenerSpy = jest.spyOn(element, 'removeEventListener');

    fixture.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
