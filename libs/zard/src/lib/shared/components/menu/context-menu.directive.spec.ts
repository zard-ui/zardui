import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { screen } from '@testing-library/angular';

import { ZardMenuImports } from '@/shared/components/menu/menu.imports';

import { ZardContextMenuDirective } from './context-menu.directive';

@Component({
  imports: [ZardMenuImports],
  template: `
    <div z-context-menu [zContextMenuTriggerFor]="contextMenu" class="test-area" data-testid="context-menu-trigger">
      Right click here
    </div>

    <ng-template #contextMenu>
      <div z-menu-content class="w-48" data-testid="context-menu-content">
        <button type="button" z-menu-item (click)="log('Test')" data-testid="menu-item">Test Item</button>
      </div>
    </ng-template>
  `,
})
class TestComponent {
  log(item: string): void {
    console.log('Clicked:', item);
  }
}

describe('ZardContextMenuDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let triggerElement: HTMLElement;
  let directiveDebugElement: DebugElement;
  let directive: ZardContextMenuDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    triggerElement = screen.getByTestId('context-menu-trigger');
    directiveDebugElement = fixture.debugElement.query(By.directive(ZardContextMenuDirective));
    directive = directiveDebugElement.injector.get(ZardContextMenuDirective);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates directive and component instances', () => {
    expect(directive).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('sets correct host attributes when enabled', () => {
      expect(triggerElement.getAttribute('data-disabled')).toBeNull();
      expect(triggerElement.getAttribute('tabindex')).toBe('0');
      expect(triggerElement.style.cursor).toBe('context-menu');
    });
  });

  describe('keyboard interactions', () => {
    it('opens context menu when ContextMenu key is pressed', () => {
      const cdkTriggerSpy = jest.spyOn(directive['cdkTrigger'], 'open');
      const preventDefaultSpy = jest.fn();

      const event = new KeyboardEvent('keydown', {
        key: 'ContextMenu',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      triggerElement.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(cdkTriggerSpy).toHaveBeenCalled();
    });

    it('opens context menu when Shift+F10 is pressed', () => {
      const cdkTriggerSpy = jest.spyOn(directive['cdkTrigger'], 'open');
      const preventDefaultSpy = jest.fn();

      const event = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      triggerElement.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(cdkTriggerSpy).toHaveBeenCalled();
    });

    it('ignores other keyboard events', () => {
      const cdkTriggerSpy = jest.spyOn(directive['cdkTrigger'], 'open');
      const preventDefaultSpy = jest.fn();

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      triggerElement.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(cdkTriggerSpy).not.toHaveBeenCalled();
    });

    it('ignores F10 without Shift key', () => {
      const cdkTriggerSpy = jest.spyOn(directive['cdkTrigger'], 'open');
      const preventDefaultSpy = jest.fn();

      const event = new KeyboardEvent('keydown', {
        key: 'F10',
        shiftKey: false,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
      triggerElement.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(cdkTriggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('menu positioning', () => {
    it('sets correct menu position on initialization', () => {
      expect(directive['cdkTrigger'].menuPosition).toEqual([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);
    });
  });
});
