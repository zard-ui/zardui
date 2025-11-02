import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardResizablePanelComponent } from './resizable-panel.component';

@Component({
  selector: 'test-panel-host',
  standalone: true,
  imports: [ZardResizablePanelComponent],
  template: `
    <z-resizable-panel
      [zDefaultSize]="defaultSize"
      [zMin]="min"
      [zMax]="max"
      [zCollapsible]="collapsible"
      [zResizable]="resizable"
      [class]="customClass"
    >
      <div>Panel Content</div>
    </z-resizable-panel>
  `,
})
class TestPanelHostComponent {
  defaultSize: number | string | undefined = 50;
  min: number | string = 10;
  max: number | string = 90;
  collapsible = false;
  resizable = true;
  customClass = '';
}

describe('ZardResizablePanelComponent', () => {
  let fixture: ComponentFixture<TestPanelHostComponent>;
  let hostComponent: TestPanelHostComponent;
  let panelComponent: ZardResizablePanelComponent;
  let panelElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPanelHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPanelHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    panelComponent = fixture.debugElement.query(By.directive(ZardResizablePanelComponent)).componentInstance;
    panelElement = fixture.debugElement.query(By.directive(ZardResizablePanelComponent)).nativeElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(panelComponent).toBeTruthy();
    });

    it('should render panel content', () => {
      const content = panelElement.textContent?.trim();
      expect(content).toBe('Panel Content');
    });

    it('should have exportAs property', () => {
      const debugElement = fixture.debugElement.query(By.directive(ZardResizablePanelComponent));
      expect(debugElement.componentInstance).toBeTruthy();
    });
  });

  describe('Input Properties', () => {
    it('should set default size', () => {
      expect(panelComponent.zDefaultSize()).toBe(50);
    });

    it('should handle undefined default size', () => {
      hostComponent.defaultSize = undefined;
      fixture.detectChanges();
      expect(panelComponent.zDefaultSize()).toBeUndefined();
    });

    it('should handle string default size', () => {
      hostComponent.defaultSize = '60%';
      fixture.detectChanges();
      expect(panelComponent.zDefaultSize()).toBe('60%');
    });

    it('should set min value', () => {
      expect(panelComponent.zMin()).toBe(10);
    });

    it('should set max value', () => {
      expect(panelComponent.zMax()).toBe(90);
    });

    it('should handle string min/max values', () => {
      hostComponent.min = '15%';
      hostComponent.max = '85%';
      fixture.detectChanges();

      expect(panelComponent.zMin()).toBe('15%');
      expect(panelComponent.zMax()).toBe('85%');
    });

    it('should set collapsible property', () => {
      expect(panelComponent.zCollapsible()).toBe(false);

      hostComponent.collapsible = true;
      fixture.detectChanges();
      expect(panelComponent.zCollapsible()).toBe(true);
    });

    it('should set resizable property', () => {
      expect(panelComponent.zResizable()).toBe(true);

      hostComponent.resizable = false;
      fixture.detectChanges();
      expect(panelComponent.zResizable()).toBe(false);
    });

    it('should handle transform inputs correctly', () => {
      // Test boolean transform for collapsible (empty string = true)
      hostComponent.collapsible = '' as any;
      fixture.detectChanges();
      expect(panelComponent.zCollapsible()).toBe(true);

      hostComponent.collapsible = 'false' as any;
      fixture.detectChanges();
      expect(panelComponent.zCollapsible()).toBe(false);

      // Test boolean transform for resizable
      hostComponent.resizable = '' as any;
      fixture.detectChanges();
      expect(panelComponent.zResizable()).toBe(true);

      hostComponent.resizable = 'false' as any;
      fixture.detectChanges();
      expect(panelComponent.zResizable()).toBe(false);
    });
  });

  describe('CSS Classes', () => {
    it('should apply default CSS classes', () => {
      expect(panelElement.classList).toContain('relative');
      expect(panelElement.classList).toContain('overflow-hidden');
      expect(panelElement.classList).toContain('flex-shrink-0');
      expect(panelElement.classList).toContain('h-full');
    });

    it('should apply custom CSS classes', () => {
      hostComponent.customClass = 'custom-panel-class';
      fixture.detectChanges();

      expect(panelElement.classList).toContain('custom-panel-class');
    });

    it('should merge custom classes with default classes', () => {
      hostComponent.customClass = 'bg-red-500 p-4';
      fixture.detectChanges();

      expect(panelElement.classList).toContain('relative');
      expect(panelElement.classList).toContain('flex-shrink-0');
      expect(panelElement.classList).toContain('bg-red-500');
      expect(panelElement.classList).toContain('p-4');
    });
  });

  describe('Collapsed State', () => {
    it('should detect collapsed state when width is 0', () => {
      panelElement.style.width = '0%';
      panelElement.style.height = '100%';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should detect collapsed state when height is 0', () => {
      panelElement.style.width = '100%';
      panelElement.style.height = '0%';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should set data-collapsed attribute when width is 0', () => {
      panelElement.style.width = '0px';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should set data-collapsed attribute when height is 0', () => {
      panelElement.style.height = '0px';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });

    it('should apply collapsed variant classes when collapsed', () => {
      panelElement.style.width = '0%';
      fixture.detectChanges();

      // The collapsed variant class should be applied
      expect(panelElement.classList).toContain('hidden');
    });
  });

  describe('ElementRef', () => {
    it('should expose elementRef', () => {
      expect(panelComponent.elementRef).toBeDefined();
      expect(panelComponent.elementRef.nativeElement).toBe(panelElement);
    });
  });

  describe('Host Bindings', () => {
    it('should bind classes to host element', () => {
      expect(panelElement.getAttribute('class')).toContain('flex');
    });

    it('should bind data-collapsed attribute to host element', () => {
      panelElement.style.width = '0%';
      fixture.detectChanges();

      expect(panelElement.getAttribute('data-collapsed')).toBe('true');
    });
  });

  describe('Content Projection', () => {
    it('should project content correctly', () => {
      const projectedContent = panelElement.querySelector('div');
      expect(projectedContent).toBeTruthy();
      expect(projectedContent?.textContent?.trim()).toBe('Panel Content');
    });

    it('should handle complex projected content', () => {
      const complexHostComponent = TestBed.createComponent(ComplexContentHostComponent);
      complexHostComponent.detectChanges();

      const complexPanelElement = complexHostComponent.debugElement.query(
        By.directive(ZardResizablePanelComponent),
      ).nativeElement;

      expect(complexPanelElement.querySelector('h2')).toBeTruthy();
      expect(complexPanelElement.querySelector('p')).toBeTruthy();
      expect(complexPanelElement.querySelector('button')).toBeTruthy();
    });
  });

  describe('Default Values', () => {
    let defaultComponent: ZardResizablePanelComponent;

    beforeEach(() => {
      const defaultFixture = TestBed.createComponent(ZardResizablePanelComponent);
      defaultComponent = defaultFixture.componentInstance;
      defaultFixture.detectChanges();
    });

    it('should have correct default values', () => {
      expect(defaultComponent.zDefaultSize()).toBeUndefined();
      expect(defaultComponent.zMin()).toBe(0);
      expect(defaultComponent.zMax()).toBe(100);
      expect(defaultComponent.zCollapsible()).toBe(false);
      expect(defaultComponent.zResizable()).toBe(true);
      expect(defaultComponent.class()).toBe('');
    });
  });
});

@Component({
  selector: 'test-complex-content-host',
  standalone: true,
  imports: [ZardResizablePanelComponent],
  template: `
    <z-resizable-panel>
      <h2>Panel Title</h2>
      <p>Panel description with some text content.</p>
      <button type="button">Action Button</button>
    </z-resizable-panel>
  `,
})
class ComplexContentHostComponent {}
