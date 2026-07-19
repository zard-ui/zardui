import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent, type ZardResizeEvent } from './resizable.component';

@Component({
  selector: 'test-handle-host',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable [zLayout]="layout">
      <z-resizable-panel [zDefaultSize]="defaultSize1" [zCollapsible]="collapsible1" [zResizable]="resizable1">
        Panel 1
      </z-resizable-panel>
      <z-resizable-handle
        [zHandleIndex]="0"
        [zWithHandle]="withHandle"
        [zDisabled]="handleDisabled"
        [class]="customClass"
      />
      <z-resizable-panel [zDefaultSize]="defaultSize2" [zCollapsible]="collapsible2" [zResizable]="resizable2">
        Panel 2
      </z-resizable-panel>
    </z-resizable>
  `,
})
class TestHandleHostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  defaultSize1 = 50;
  defaultSize2 = 50;
  collapsible1 = false;
  collapsible2 = false;
  resizable1 = true;
  resizable2 = true;
  withHandle = false;
  handleDisabled = false;
  customClass = '';
}

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

    Object.defineProperty(
      fixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement,
      'offsetWidth',
      { value: 1000, configurable: true },
    );
  });

  describe('Component Creation', () => {
    it('creates the handle component', () => {
      expect(handleComponent).toBeTruthy();
    });

    it('sets data-slot attribute to resizable-handle', () => {
      expect(handleElement.getAttribute('data-slot')).toBe('resizable-handle');
    });

    it('sets role separator', () => {
      expect(handleElement.getAttribute('role')).toBe('separator');
    });

    it('sets data-separator to inactive by default', () => {
      expect(handleElement.getAttribute('data-separator')).toBe('inactive');
    });

    it('sets data-separator to active on mousedown', () => {
      handleComponent.handleMouseDown(new MouseEvent('mousedown', { clientX: 500 }));
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('active');
    });
  });

  describe('Default Inputs', () => {
    it('defaults zWithHandle to false', () => {
      expect(handleComponent.zWithHandle()).toBe(false);
    });

    it('defaults zDisabled to false', () => {
      expect(handleComponent.zDisabled()).toBe(false);
    });

    it('defaults zHandleIndex to 0', () => {
      expect(handleComponent.zHandleIndex()).toBe(0);
    });
  });

  describe('Layout Computation', () => {
    it('computes handle layout as vertical when group is horizontal', () => {
      hostComponent.layout = 'horizontal';
      fixture.detectChanges();

      expect(handleElement.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('computes handle layout as horizontal when group is vertical', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      expect(handleElement.getAttribute('aria-orientation')).toBe('horizontal');
    });
  });

  describe('CSS Classes', () => {
    it('applies default handle classes', () => {
      expect(handleElement.classList).toContain('relative');
      expect(handleElement.classList).toContain('flex');
    });

    it('applies cursor-ew-resize for horizontal group layout', () => {
      expect(handleElement.classList).toContain('cursor-ew-resize');
    });

    it('applies cursor-ns-resize for vertical group layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      expect(handleElement.classList).toContain('cursor-ns-resize');
    });

    it('merges custom class with default classes', () => {
      hostComponent.customClass = 'my-custom-handle';
      fixture.detectChanges();

      expect(handleElement.classList).toContain('my-custom-handle');
      expect(handleElement.classList).toContain('relative');
    });
  });

  describe('Disabled State', () => {
    it('sets aria-disabled when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      expect(handleElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('removes tabindex when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      expect(handleElement.getAttribute('tabindex')).toBeNull();
    });

    it('sets tabindex to 0 when enabled', () => {
      hostComponent.handleDisabled = false;
      fixture.detectChanges();

      expect(handleElement.getAttribute('tabindex')).toBe('0');
    });

    it('applies disabled cursor classes when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      expect(handleElement.classList).toContain('pointer-events-none');
      expect(handleElement.classList).toContain('opacity-50');
    });

    it('does not start resize on mousedown when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'startResize');
      handleComponent.handleMouseDown(new MouseEvent('mousedown'));

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not start resize on touchstart when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'startResize');
      const touchMock = { clientX: 100, clientY: 100 } as Touch;
      const listMock = { length: 1, item: () => touchMock, 0: touchMock };
      const touchEvent = new TouchEvent('touchstart', { touches: listMock as unknown as Touch[] });

      handleComponent.handleTouchStart(touchEvent);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('With Handle Indicator', () => {
    it('does not render handle indicator by default', () => {
      const indicator = handleElement.querySelector('div');

      expect(indicator).toBeNull();
    });

    it('renders handle indicator when zWithHandle is true', () => {
      hostComponent.withHandle = true;
      fixture.detectChanges();

      const indicator = handleElement.querySelector('div');

      expect(indicator).toBeTruthy();
    });
  });

  describe('Mouse Interactions', () => {
    it('starts resize on mousedown', () => {
      const spy = jest.spyOn(resizableComponent, 'startResize');
      const event = new MouseEvent('mousedown', { clientX: 500 });

      handleComponent.handleMouseDown(event);

      expect(spy).toHaveBeenCalledWith(0, event);
    });

    it('does not start resize when panel is not resizable', () => {
      hostComponent.resizable1 = false;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'startResize');
      handleComponent.handleMouseDown(new MouseEvent('mousedown'));

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not start resize when adjacent panel is not resizable', () => {
      hostComponent.resizable2 = false;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'startResize');
      handleComponent.handleMouseDown(new MouseEvent('mousedown'));

      expect(spy).not.toHaveBeenCalled();
    });

    it('resets to inactive state on mouseup', () => {
      handleComponent.handleMouseUp();
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('inactive');
    });

    it('transitions to hover state on mouseenter', () => {
      handleComponent.handleMouseHover(true);
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('hover');
    });

    it('transitions to inactive state on mouseleave', () => {
      handleComponent.handleMouseHover(false);
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('inactive');
    });

    it('ignores hover events while mouse is down', () => {
      handleComponent.handleMouseDown(new MouseEvent('mousedown', { clientX: 500 }));

      handleComponent.handleMouseHover(true);
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('active');
    });

    it('ignores hover events when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      handleComponent.handleMouseHover(true);
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('inactive');
    });
  });

  describe('Touch Interactions', () => {
    it('starts resize on touchstart', () => {
      const spy = jest.spyOn(resizableComponent, 'startResize');
      const touchMock = { clientX: 500, clientY: 300 } as Touch;
      const listMock = { length: 1, item: () => touchMock, 0: touchMock };
      const touchEvent = new TouchEvent('touchstart', { touches: listMock as unknown as Touch[] });

      handleComponent.handleTouchStart(touchEvent);

      expect(spy).toHaveBeenCalledWith(0, touchEvent);
    });

    it('sets inactive state on touchend', () => {
      handleComponent.handleTouchEnd();
      fixture.detectChanges();

      expect(handleElement.getAttribute('data-separator')).toBe('inactive');
    });
  });

  describe('Keyboard Interactions', () => {
    it('collapses panel on Enter when panel is collapsible', () => {
      hostComponent.collapsible1 = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'collapsePanel');
      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(spy).toHaveBeenCalledWith(0);
    });

    it('collapses adjacent panel on Enter when it is collapsible', () => {
      hostComponent.collapsible2 = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'collapsePanel');
      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(spy).toHaveBeenCalledWith(1);
    });

    it('does not collapse on Enter when no panel is collapsible', () => {
      const spy = jest.spyOn(resizableComponent, 'collapsePanel');
      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(spy).not.toHaveBeenCalled();
    });

    it('collapses panel on Space when panel is collapsible', () => {
      hostComponent.collapsible1 = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'collapsePanel');
      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: ' ' }));

      expect(spy).toHaveBeenCalledWith(0);
    });

    it('ignores keyboard events when disabled', () => {
      hostComponent.handleDisabled = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'collapsePanel');
      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(spy).not.toHaveBeenCalled();
    });

    it('adjusts sizes on ArrowLeft for horizontal group', () => {
      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeLessThan(initialSizes[0]);
      expect(sizes[1]).toBeGreaterThan(initialSizes[1]);
    });

    it('adjusts sizes on ArrowRight for horizontal group', () => {
      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeGreaterThan(initialSizes[0]);
      expect(sizes[1]).toBeLessThan(initialSizes[1]);
    });

    it('adjusts sizes on ArrowUp for vertical group', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      Object.defineProperty(
        fixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement,
        'offsetHeight',
        { value: 600, configurable: true },
      );

      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeLessThan(initialSizes[0]);
      expect(sizes[1]).toBeGreaterThan(initialSizes[1]);
    });

    it('adjusts sizes on ArrowDown for vertical group', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      Object.defineProperty(
        fixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement,
        'offsetHeight',
        { value: 600, configurable: true },
      );

      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeGreaterThan(initialSizes[0]);
      expect(sizes[1]).toBeLessThan(initialSizes[1]);
    });

    it('applies larger delta with shift key on ArrowRight', () => {
      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      const afterNormal = [...resizableComponent.panelSizes()];
      const normalDelta = Math.abs(afterNormal[0] - initialSizes[0]);

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true }));
      const afterShift = resizableComponent.panelSizes();
      const shiftDelta = Math.abs(afterShift[0] - afterNormal[0]);

      expect(shiftDelta).toBeGreaterThan(normalDelta);
      expect(shiftDelta).toBe(10);
    });

    it('ignores ArrowLeft/Right for vertical group', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(resizableComponent.panelSizes()).toEqual(initialSizes);
    });

    it('ignores ArrowUp/Down for horizontal group', () => {
      const initialSizes = [...resizableComponent.panelSizes()];

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      expect(resizableComponent.panelSizes()).toEqual(initialSizes);
    });

    it('emits resize event on arrow key adjustment', () => {
      const emitted: ZardResizeEvent[] = [];
      resizableComponent.zResize.subscribe(event => emitted.push(event));

      handleComponent.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(emitted.length).toBe(1);
      expect(emitted[0].layout).toBe('horizontal');
    });
  });

  describe('Integration', () => {
    let resizeEvents: ZardResizeEvent[];

    beforeEach(() => {
      resizeEvents = [];
      resizableComponent.zResize.subscribe(event => resizeEvents.push(event));
    });

    it('completes a full mouse resize cycle', () => {
      const initialSizes = [...resizableComponent.panelSizes()];

      const mouseDown = new MouseEvent('mousedown', { clientX: 500 });
      handleComponent.handleMouseDown(mouseDown);

      const mouseMove = new MouseEvent('mousemove', { clientX: 600 });
      document.dispatchEvent(mouseMove);

      const lastEvent = resizeEvents[resizeEvents.length - 1];
      expect(lastEvent.sizes[0]).toBeGreaterThan(initialSizes[0]);
      expect(lastEvent.sizes[1]).toBeLessThan(initialSizes[1]);
      expect(resizeEvents.length).toBeGreaterThanOrEqual(1);

      const mouseUp = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUp);

      const countAfterUp = resizeEvents.length;

      const extraMove = new MouseEvent('mousemove', { clientX: 700 });
      document.dispatchEvent(extraMove);

      expect(resizeEvents.length).toBe(countAfterUp);
    });
  });
});
