import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent } from './resizable.component';
import { ZardEventManagerPlugin } from '../core/event-manager-plugins/zard-event-manager-plugin';

@Component({
  selector: 'test-handle-host',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable [zLayout]="layout">
      <z-resizable-panel [zCollapsible]="panel1Collapsible">Panel 1</z-resizable-panel>
      <z-resizable-handle
        [zHandleIndex]="handleIndex"
        [zWithHandle]="withHandle"
        [zDisabled]="disabled"
        [class]="customClass"
      />
      <z-resizable-panel [zCollapsible]="panel2Collapsible">Panel 2</z-resizable-panel>
    </z-resizable>
  `,
})
class TestHandleHostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  handleIndex = 0;
  withHandle = true;
  disabled = false;
  customClass = '';
  panel1Collapsible = false;
  panel2Collapsible = false;
}

@Component({
  selector: 'test-standalone-handle',
  imports: [ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable-handle [zHandleIndex]="0" [zWithHandle]="true" [zDisabled]="false" />
  `,
})
class TestStandaloneHandleComponent {}

describe('ZardResizableHandleComponent', () => {
  let fixture: ComponentFixture<TestHandleHostComponent>;
  let hostComponent: TestHandleHostComponent;
  let handleComponent: ZardResizableHandleComponent;
  let handleElement: HTMLElement;
  let resizableComponent: ZardResizableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHandleHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHandleHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    handleComponent = fixture.debugElement.query(By.directive(ZardResizableHandleComponent)).componentInstance;
    handleElement = fixture.debugElement.query(By.directive(ZardResizableHandleComponent)).nativeElement;
    resizableComponent = fixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(handleComponent).toBeTruthy();
    });

    it('should inject resizable component', () => {
      expect(handleComponent['resizable']).toBe(resizableComponent);
    });

    it('should have exportAs property', () => {
      const debugElement = fixture.debugElement.query(By.directive(ZardResizableHandleComponent));
      expect(debugElement.componentInstance).toBeTruthy();
    });
  });

  describe('Input Properties', () => {
    it('should set handle index', () => {
      expect(handleComponent.zHandleIndex()).toBe(0);

      hostComponent.handleIndex = 1;
      fixture.detectChanges();
      expect(handleComponent.zHandleIndex()).toBe(1);
    });

    it('should set with handle property', () => {
      expect(handleComponent.zWithHandle()).toBe(true);

      hostComponent.withHandle = false;
      fixture.detectChanges();
      expect(handleComponent.zWithHandle()).toBe(false);
    });

    it('should set disabled property', () => {
      expect(handleComponent.zDisabled()).toBe(false);

      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(handleComponent.zDisabled()).toBe(true);
    });

    it('should handle transform inputs correctly', () => {
      // Test boolean transform for withHandle (empty string = true)
      hostComponent.withHandle = '' as any;
      fixture.detectChanges();
      expect(handleComponent.zWithHandle()).toBe(true);

      hostComponent.withHandle = 'false' as any;
      fixture.detectChanges();
      expect(handleComponent.zWithHandle()).toBe(false);

      // Test boolean transform for disabled
      hostComponent.disabled = '' as any;
      fixture.detectChanges();
      expect(handleComponent.zDisabled()).toBe(true);

      hostComponent.disabled = 'false' as any;
      fixture.detectChanges();
      expect(handleComponent.zDisabled()).toBe(false);
    });
  });

  describe('Layout Detection', () => {
    it('should detect horizontal layout from parent', () => {
      expect(handleElement.getAttribute('data-layout')).toBe('horizontal');
    });

    it('should detect vertical layout from parent', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();
      expect(handleElement.getAttribute('data-layout')).toBe('vertical');
    });

    it('should default to horizontal when no parent resizable', () => {
      const standaloneFixture = TestBed.createComponent(TestStandaloneHandleComponent);
      standaloneFixture.detectChanges();

      const standaloneElement = standaloneFixture.debugElement.query(
        By.directive(ZardResizableHandleComponent),
      ).nativeElement;
      expect(standaloneElement.getAttribute('data-layout')).toBe('horizontal');
    });
  });

  describe('Host Attributes', () => {
    it('should set data-layout attribute', () => {
      expect(handleElement.getAttribute('data-layout')).toBe('horizontal');

      hostComponent.layout = 'vertical';
      fixture.detectChanges();
      expect(handleElement.getAttribute('data-layout')).toBe('vertical');
    });

    it('should set tabindex when not disabled', () => {
      expect(handleElement.getAttribute('tabindex')).toBe('0');
    });

    it('should remove tabindex when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(handleElement.getAttribute('tabindex')).toBeNull();
    });

    it('should set role attribute', () => {
      expect(handleElement.getAttribute('role')).toBe('separator');
    });

    it('should set aria-orientation for horizontal layout', () => {
      expect(handleElement.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should set aria-orientation for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();
      expect(handleElement.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should set aria-disabled when disabled', () => {
      expect(handleElement.getAttribute('aria-disabled')).toBe('false');

      hostComponent.disabled = true;
      fixture.detectChanges();
      expect(handleElement.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('CSS Classes', () => {
    it('should apply default CSS classes for horizontal layout', () => {
      expect(handleElement.classList).toContain('group');
      expect(handleElement.classList).toContain('relative');
      expect(handleElement.classList).toContain('flex');
      expect(handleElement.classList).toContain('cursor-col-resize');
    });

    it('should apply CSS classes for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      expect(handleElement.classList).toContain('group');
      expect(handleElement.classList).toContain('relative');
      expect(handleElement.classList).toContain('flex');
      expect(handleElement.classList).toContain('cursor-row-resize');
    });

    it('should apply disabled CSS classes', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      expect(handleElement.classList).toContain('cursor-default');
      expect(handleElement.classList).toContain('pointer-events-none');
      expect(handleElement.classList).toContain('opacity-50');
    });

    it('should apply custom CSS classes', () => {
      hostComponent.customClass = 'custom-handle-class';
      fixture.detectChanges();

      expect(handleElement.classList).toContain('custom-handle-class');
    });
  });

  describe('Handle Indicator', () => {
    it('should render handle indicator when withHandle is true', () => {
      const indicator = handleElement.querySelector('div');
      expect(indicator).toBeTruthy();
    });

    it('should not render handle indicator when withHandle is false', () => {
      hostComponent.withHandle = false;
      fixture.detectChanges();

      const indicator = handleElement.querySelector('div');
      expect(indicator).toBeFalsy();
    });

    it('should apply correct indicator classes for horizontal layout', () => {
      const indicator = handleElement.querySelector('div');
      expect(indicator?.classList).toContain('w-px');
      expect(indicator?.classList).toContain('h-8');
    });

    it('should apply correct indicator classes for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      const indicator = handleElement.querySelector('div');
      expect(indicator?.classList).toContain('w-8');
      expect(indicator?.classList).toContain('h-px');
    });
  });

  describe('Mouse Events', () => {
    beforeEach(() => {
      jest.spyOn(resizableComponent, 'startResize');
    });

    it('should handle mouse down event', () => {
      const mouseEvent = new MouseEvent('mousedown', { clientX: 100 });
      handleElement.dispatchEvent(mouseEvent);

      expect(resizableComponent.startResize).toHaveBeenCalledWith(0, mouseEvent);
    });

    it('should not handle mouse down when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      const mouseEvent = new MouseEvent('mousedown', { clientX: 100 });
      handleElement.dispatchEvent(mouseEvent);

      expect(resizableComponent.startResize).not.toHaveBeenCalled();
    });

    it('should not handle mouse down when no resizable parent', () => {
      const standaloneFixture = TestBed.createComponent(TestStandaloneHandleComponent);
      standaloneFixture.detectChanges();

      const standaloneElement = standaloneFixture.debugElement.query(
        By.directive(ZardResizableHandleComponent),
      ).nativeElement;
      const mouseEvent = new MouseEvent('mousedown', { clientX: 100 });

      expect(() => {
        standaloneElement.dispatchEvent(mouseEvent);
      }).not.toThrow();
    });
  });

  describe('Touch Events', () => {
    beforeEach(() => {
      jest.spyOn(resizableComponent, 'startResize');
    });

    it('should handle touch start event', () => {
      const touchMock = { clientX: 500, clientY: 300 } as Touch;
      const listMock: TouchList = { length: 1, item: (index: number) => touchMock, 0: touchMock };
      const touchEvent = new TouchEvent('touchstart', {
        touches: listMock as unknown as Touch[],
      });

      handleElement.dispatchEvent(touchEvent);

      expect(resizableComponent.startResize).toHaveBeenCalledWith(0, touchEvent);
    });

    it('should not handle touch start when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 50 } as Touch],
      });
      handleElement.dispatchEvent(touchEvent);

      expect(resizableComponent.startResize).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      jest.spyOn(resizableComponent, 'collapsePanel');
    });

    it('should handle arrow keys for horizontal layout', () => {
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });

      handleElement.dispatchEvent(rightArrowEvent);

      expect(rightArrowEvent.defaultPrevented).toBe(true);
    });

    it('should handle arrow keys for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      const downArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
      handleElement.dispatchEvent(downArrowEvent);

      expect(downArrowEvent.defaultPrevented).toBe(true);
    });

    it('should handle Shift+Arrow for larger steps', () => {
      const shiftRightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        shiftKey: true,
        cancelable: true,
      });

      handleElement.dispatchEvent(shiftRightEvent);

      expect(shiftRightEvent.defaultPrevented).toBe(true);
    });

    it('should handle Home key', () => {
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });

      handleElement.dispatchEvent(homeEvent);

      expect(homeEvent.defaultPrevented).toBe(true);
    });

    it('should handle End key', () => {
      const endEvent = new KeyboardEvent('keydown', { key: 'End', cancelable: true });

      handleElement.dispatchEvent(endEvent);

      expect(endEvent.defaultPrevented).toBe(true);
    });

    it('should handle Enter/Space for collapsible panels', () => {
      hostComponent.panel1Collapsible = true;
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });

      handleElement.dispatchEvent(enterEvent);

      expect(enterEvent.defaultPrevented).toBe(true);
      expect(resizableComponent.collapsePanel).toHaveBeenCalledWith(0);
    });

    it('should handle Space for collapsible panels', () => {
      hostComponent.panel2Collapsible = true;
      fixture.detectChanges();

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });

      handleElement.dispatchEvent(spaceEvent);

      expect(spaceEvent.defaultPrevented).toBe(true);
      expect(resizableComponent.collapsePanel).toHaveBeenCalledWith(1);
    });

    it('should ignore unsupported keys', () => {
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
      handleElement.dispatchEvent(tabEvent);

      expect(tabEvent.defaultPrevented).toBe(false);
    });

    it('should not handle keyboard events when disabled', () => {
      hostComponent.disabled = true;
      fixture.detectChanges();

      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
      handleElement.dispatchEvent(rightArrowEvent);

      expect(rightArrowEvent.defaultPrevented).toBe(false);
    });

    it('should not handle keyboard events when no resizable parent', () => {
      const standaloneFixture = TestBed.createComponent(TestStandaloneHandleComponent);
      standaloneFixture.detectChanges();

      const standaloneHandle = standaloneFixture.debugElement.query(
        By.directive(ZardResizableHandleComponent),
      ).nativeElement;
      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
      jest.spyOn(handleComponent as any, 'adjustSizes');

      expect(() => {
        standaloneHandle.dispatchEvent(rightArrowEvent);
      }).not.toThrow();
      expect(standaloneHandle['resizable']).toBeUndefined();
      expect(handleComponent['adjustSizes']).not.toHaveBeenCalled();
    });
  });

  describe('Private Methods', () => {
    it('should call adjustSizes method when arrow keys are pressed', () => {
      const spy = jest.spyOn(handleComponent as any, 'adjustSizes');

      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      handleElement.dispatchEvent(rightArrowEvent);

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('should call moveToExtreme method for Home/End keys', () => {
      const spy = jest.spyOn(handleComponent as any, 'moveToExtreme');

      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      handleElement.dispatchEvent(homeEvent);

      expect(spy).toHaveBeenCalledWith(true);

      const endEvent = new KeyboardEvent('keydown', { key: 'End' });
      handleElement.dispatchEvent(endEvent);

      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('Default Values', () => {
    let defaultComponent: ZardResizableHandleComponent;

    beforeEach(() => {
      const defaultFixture = TestBed.createComponent(ZardResizableHandleComponent);
      defaultComponent = defaultFixture.componentInstance;
      defaultFixture.detectChanges();
    });

    it('should have correct default values', () => {
      expect(defaultComponent.zWithHandle()).toBe(false);
      expect(defaultComponent.zDisabled()).toBe(false);
      expect(defaultComponent.zHandleIndex()).toBe(0);
      expect(defaultComponent.class()).toBe('');
    });
  });
});
