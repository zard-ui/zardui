import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent, ZardResizeEvent } from './resizable.component';
import { ZardEventManagerPlugin } from '../core/zard-event-manager-plugin';

@Component({
  selector: 'test-resizable-host',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable
      [zLayout]="layout"
      [zLazy]="lazy"
      (zResizeStart)="onResizeStart($event)"
      (zResize)="onResize($event)"
      (zResizeEnd)="onResizeEnd($event)"
    >
      <z-resizable-panel [zDefaultSize]="defaultSize1" [zMin]="min1" [zMax]="max1" [zCollapsible]="collapsible1">
        Panel 1
      </z-resizable-panel>
      <z-resizable-handle [zHandleIndex]="0" [zWithHandle]="withHandle" [zDisabled]="handleDisabled" />
      <z-resizable-panel [zDefaultSize]="defaultSize2" [zMin]="min2" [zMax]="max2" [zCollapsible]="collapsible2">
        Panel 2
      </z-resizable-panel>
    </z-resizable>
  `,
})
class TestResizableHostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  lazy = false;
  defaultSize1: number | string | undefined = 50;
  defaultSize2: number | string | undefined = 50;
  min1: number | string = 10;
  max1: number | string = 80;
  min2: number | string = 20;
  max2: number | string = 90;
  collapsible1 = false;
  collapsible2 = false;
  withHandle = true;
  handleDisabled = false;

  resizeStartEvent?: ZardResizeEvent;
  resizeEvent?: ZardResizeEvent;
  resizeEndEvent?: ZardResizeEvent;

  onResizeStart(event: ZardResizeEvent) {
    this.resizeStartEvent = event;
  }

  onResize(event: ZardResizeEvent) {
    this.resizeEvent = event;
  }

  onResizeEnd(event: ZardResizeEvent) {
    this.resizeEndEvent = event;
  }
}

describe('ZardResizableComponent', () => {
  let fixture: ComponentFixture<TestResizableHostComponent>;
  let hostComponent: TestResizableHostComponent;
  let resizableComponent: ZardResizableComponent;
  let resizableElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestResizableHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestResizableHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    resizableComponent = fixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
    resizableElement = fixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(resizableComponent).toBeTruthy();
    });

    it('should have correct default layout', () => {
      expect(resizableComponent.zLayout()).toBe('horizontal');
    });

    it('should set data-layout attribute on host', () => {
      expect(resizableElement.getAttribute('data-layout')).toBe('horizontal');
    });

    it('should apply CSS classes for horizontal layout', () => {
      expect(resizableElement.classList).toContain('flex');
    });
  });

  describe('Layout Configuration', () => {
    it('should handle vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      expect(resizableComponent.zLayout()).toBe('vertical');
      expect(resizableElement.getAttribute('data-layout')).toBe('vertical');
    });

    it('should handle lazy mode', () => {
      hostComponent.lazy = true;
      fixture.detectChanges();

      expect(resizableComponent.zLazy()).toBe(true);
    });
  });

  describe('Panel Initialization', () => {
    it('should find and initialize panels', () => {
      const panels = resizableComponent.panels();
      expect(panels.length).toBe(2);
    });

    it('should initialize panel sizes from default sizes', () => {
      const sizes = resizableComponent.panelSizes();
      expect(sizes.length).toBe(2);
      expect(sizes[0]).toBe(50);
      expect(sizes[1]).toBe(50);
    });

    it('should initialize panels with equal sizes when no default size is provided', () => {
      hostComponent.defaultSize1 = undefined;
      hostComponent.defaultSize2 = undefined;
      fixture.detectChanges();

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBe(50);
      expect(sizes[1]).toBe(50);
    });

    it('should handle percentage string default sizes', () => {
      // Create new fixture with different default sizes
      TestBed.resetTestingModule();

      @Component({
        selector: 'test-percentage-host',
        imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
        standalone: true,
        template: `
          <z-resizable>
            <z-resizable-panel zDefaultSize="60%">Panel 1</z-resizable-panel>
            <z-resizable-handle [zHandleIndex]="0" />
            <z-resizable-panel zDefaultSize="40%">Panel 2</z-resizable-panel>
          </z-resizable>
        `,
      })
      class TestPercentageHostComponent {}

      TestBed.configureTestingModule({
        imports: [TestPercentageHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const percentageFixture = TestBed.createComponent(TestPercentageHostComponent);
      percentageFixture.detectChanges();

      const percentageResizable = percentageFixture.debugElement.query(
        By.directive(ZardResizableComponent),
      ).componentInstance;
      const sizes = percentageResizable.panelSizes();
      expect(sizes[0]).toBe(60);
      expect(sizes[1]).toBe(40);
    });

    it('should handle pixel string default sizes', () => {
      // Create new fixture with pixel default sizes
      TestBed.resetTestingModule();

      @Component({
        selector: 'test-pixel-host',
        imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
        standalone: true,
        template: `
          <z-resizable>
            <z-resizable-panel zDefaultSize="300px">Panel 1</z-resizable-panel>
            <z-resizable-handle [zHandleIndex]="0" />
            <z-resizable-panel zDefaultSize="200px">Panel 2</z-resizable-panel>
          </z-resizable>
        `,
      })
      class TestPixelHostComponent {}

      TestBed.configureTestingModule({
        imports: [TestPixelHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const pixelFixture = TestBed.createComponent(TestPixelHostComponent);

      // Mock container size before initialization
      const pixelElement = pixelFixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement;
      Object.defineProperty(pixelElement, 'offsetWidth', { value: 500, configurable: true });

      pixelFixture.detectChanges();

      const pixelResizable = pixelFixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
      const sizes = pixelResizable.panelSizes();
      expect(sizes[0]).toBe(60); // 300px / 500px * 100 = 60%
      expect(sizes[1]).toBe(40); // 200px / 500px * 100 = 40%
    });
  });

  describe('Value Conversion', () => {
    it('should convert percentage values correctly', () => {
      const result = resizableComponent.convertToPercentage('50%', 1000);
      expect(result).toBe(50);
    });

    it('should convert pixel values correctly', () => {
      const result = resizableComponent.convertToPercentage('300px', 1000);
      expect(result).toBe(30);
    });

    it('should handle numeric values', () => {
      const result = resizableComponent.convertToPercentage(75, 1000);
      expect(result).toBe(75);
    });

    it('should handle invalid values', () => {
      const result = resizableComponent.convertToPercentage('invalid', 1000);
      expect(result).toBe(0);
    });
  });

  describe('Resize Events', () => {
    beforeEach(() => {
      Object.defineProperty(resizableElement, 'offsetWidth', { value: 1000, configurable: true });
      Object.defineProperty(resizableElement, 'offsetHeight', { value: 600, configurable: true });
    });

    it('should emit resize start event', () => {
      const mouseEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseEvent);

      expect(hostComponent.resizeStartEvent).toBeDefined();
      expect(hostComponent.resizeStartEvent?.layout).toBe('horizontal');
      expect(hostComponent.resizeStartEvent?.sizes).toEqual([50, 50]);
    });

    it('should handle mouse move during resize', () => {
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 550 });
      document.dispatchEvent(mouseMoveEvent);

      expect(hostComponent.resizeEvent).toBeDefined();
    });

    it('should handle touch events', () => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 500, clientY: 300 } as Touch],
      });
      resizableComponent.startResize(0, touchStartEvent);

      expect(hostComponent.resizeStartEvent).toBeDefined();
    });

    it('should emit resize end event on mouse up', () => {
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUpEvent);

      expect(hostComponent.resizeEndEvent).toBeDefined();
    });
  });

  describe('Panel Collapsing', () => {
    beforeEach(() => {
      hostComponent.collapsible1 = true;
      fixture.detectChanges();
    });

    it('should collapse panel when collapsible', () => {
      const initialSizes = [...resizableComponent.panelSizes()];
      resizableComponent.collapsePanel(0);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBe(0);
      expect(sizes[1]).toBeGreaterThan(initialSizes[1]);
    });

    it('should expand collapsed panel', () => {
      resizableComponent.collapsePanel(0);
      resizableComponent.collapsePanel(0);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeGreaterThan(0);
    });

    it('should not collapse non-collapsible panel', () => {
      hostComponent.collapsible1 = false;
      fixture.detectChanges();

      const initialSizes = [...resizableComponent.panelSizes()];
      resizableComponent.collapsePanel(0);

      const sizes = resizableComponent.panelSizes();
      expect(sizes).toEqual(initialSizes);
    });
  });

  describe('Container Size', () => {
    it('should get horizontal container size', () => {
      Object.defineProperty(resizableElement, 'offsetWidth', { value: 800, configurable: true });
      const size = resizableComponent.getContainerSize();
      expect(size).toBe(800);
    });

    it('should get vertical container size', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      Object.defineProperty(resizableElement, 'offsetHeight', { value: 600, configurable: true });
      const size = resizableComponent.getContainerSize();
      expect(size).toBe(600);
    });
  });

  describe('Style Updates', () => {
    it('should update panel styles for horizontal layout', () => {
      resizableComponent.panelSizes.set([60, 40]);
      resizableComponent.updatePanelStyles();

      const panels = fixture.debugElement.queryAll(By.directive(ZardResizablePanelComponent));
      const panel1Element = panels[0].nativeElement;
      const panel2Element = panels[1].nativeElement;

      expect(panel1Element.style.width).toBe('60%');
      expect(panel1Element.style.height).toBe('100%');
      expect(panel2Element.style.width).toBe('40%');
      expect(panel2Element.style.height).toBe('100%');
    });

    it('should update panel styles for vertical layout', () => {
      hostComponent.layout = 'vertical';
      fixture.detectChanges();

      resizableComponent.panelSizes.set([60, 40]);
      resizableComponent.updatePanelStyles();

      const panels = fixture.debugElement.queryAll(By.directive(ZardResizablePanelComponent));
      const panel1Element = panels[0].nativeElement;
      const panel2Element = panels[1].nativeElement;

      expect(panel1Element.style.height).toBe('60%');
      expect(panel1Element.style.width).toBe('100%');
      expect(panel2Element.style.height).toBe('40%');
      expect(panel2Element.style.width).toBe('100%');
    });
  });

  describe('Min/Max Constraints', () => {
    beforeEach(() => {
      Object.defineProperty(resizableElement, 'offsetWidth', { value: 1000, configurable: true });
    });

    it('should respect min size constraints during resize', () => {
      hostComponent.min1 = 20;
      hostComponent.min2 = 15;
      fixture.detectChanges();

      resizableComponent.panelSizes.set([25, 75]);
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 250 });
      resizableComponent.startResize(0, mouseDownEvent);

      // Try to resize beyond min constraints
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 150 });
      document.dispatchEvent(mouseMoveEvent);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeGreaterThanOrEqual(20);
      expect(sizes[1]).toBeGreaterThanOrEqual(15);
    });

    it('should respect max size constraints during resize', () => {
      hostComponent.max1 = 70;
      hostComponent.max2 = 80;
      fixture.detectChanges();

      resizableComponent.panelSizes.set([60, 40]);
      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 600 });
      resizableComponent.startResize(0, mouseDownEvent);

      // Try to resize beyond max constraints
      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 800 });
      document.dispatchEvent(mouseMoveEvent);

      const sizes = resizableComponent.panelSizes();
      expect(sizes[0]).toBeLessThanOrEqual(70);
      expect(sizes[1]).toBeLessThanOrEqual(80);
    });
  });

  describe('Lazy Mode', () => {
    it('should not update styles during resize in lazy mode', () => {
      hostComponent.lazy = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'updatePanelStyles');

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 550 });
      document.dispatchEvent(mouseMoveEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should update styles at end of resize in lazy mode', () => {
      hostComponent.lazy = true;
      fixture.detectChanges();

      const spy = jest.spyOn(resizableComponent, 'updatePanelStyles');

      const mouseDownEvent = new MouseEvent('mousedown', { clientX: 500 });
      resizableComponent.startResize(0, mouseDownEvent);

      const mouseUpEvent = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUpEvent);

      expect(spy).toHaveBeenCalled();
    });
  });
});
