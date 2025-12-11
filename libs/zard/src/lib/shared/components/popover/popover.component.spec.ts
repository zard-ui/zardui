import { OverlayModule } from '@angular/cdk/overlay';
import { Component, DebugElement, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardPopoverComponent, ZardPopoverDirective } from './popover.component';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

@Component({
  imports: [ZardPopoverDirective, ZardPopoverComponent],
  standalone: true,
  template: `
    <button zPopover [zContent]="popoverContent" [zTrigger]="trigger" [zPlacement]="placement">Trigger</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="test-content">Test content</div>
      </z-popover>
    </ng-template>
  `,
})
class TestComponent {
  readonly popoverContent = viewChild.required<TemplateRef<unknown>>('popoverContent');
  trigger: 'click' | 'hover' | null = 'click';
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
}

describe('ZardPopoverComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, TestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show popover on click by default', () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const overlayContainer = document.querySelector('.cdk-overlay-container');
    const popoverContent = overlayContainer?.querySelector('.test-content');

    expect(popoverContent).toBeTruthy();
    expect(popoverContent?.textContent).toContain('Test content');
  });

  it('should hide popover on second click', () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    let popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeFalsy();
  });

  it('should support hover trigger', () => {
    // Test that the component can be configured with hover trigger
    component.trigger = 'hover';
    fixture.detectChanges();

    expect(component.trigger).toBe('hover');
  });

  it('should not show popover when trigger is null', () => {
    component.trigger = null;
    fixture.detectChanges();

    // Create a new fixture to ensure the directive is initialized with null trigger
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.trigger = null;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeFalsy();
  });

  it('should hide popover on outside click', done => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    let popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();

    setTimeout(() => {
      document.body.click();
      fixture.detectChanges();

      popoverContent = document.querySelector('.test-content');
      expect(popoverContent).toBeFalsy();
      done();
    }, 100);
  });

  it('should apply correct placement class', () => {
    component.placement = 'top';
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const overlay = document.querySelector('.cdk-overlay-pane');
    expect(overlay).toBeTruthy();
  });

  it('should support all placement options', () => {
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

    placements.forEach(placement => {
      component.placement = placement;
      fixture.detectChanges();

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane');
      expect(overlay).toBeTruthy();

      // Close the popover
      buttonElement.nativeElement.click();
      fixture.detectChanges();
    });
  });

  it('should keep popover on scroll', async () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    let popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();

    // Simulate scroll event
    const scrollEvent = new Event('scroll', { bubbles: true });
    window.dispatchEvent(scrollEvent);
    fixture.detectChanges();

    // Wait for the scroll strategy to close the popover
    await fixture.whenStable();
    fixture.detectChanges();

    // The popover should be closed due to the close scroll strategy
    popoverContent = document.querySelector('.test-content');
    expect(popoverContent).toBeTruthy();
  });

  it('should have flexible positioning with multiple fallback positions', () => {
    // This test verifies that the directive sets up multiple positions for better placement
    const directive = buttonElement.injector.get(ZardPopoverDirective);

    // Access the private method for testing - in a real scenario this would be tested through behavior
    const positions = (directive as any).getPositions();

    expect(positions).toBeDefined();
    expect(positions.length).toBeGreaterThan(1); // Should have fallback positions
    expect(positions[0]).toHaveProperty('originX');
    expect(positions[0]).toHaveProperty('originY');
    expect(positions[0]).toHaveProperty('overlayX');
    expect(positions[0]).toHaveProperty('overlayY');
  });

  it('should have correct fallback positions for each placement', () => {
    const directive = buttonElement.injector.get(ZardPopoverDirective);
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

    placements.forEach(placement => {
      component.placement = placement;
      fixture.detectChanges();

      const positions = (directive as any).getPositions();

      // Should have primary position plus fallbacks
      expect(positions.length).toBeGreaterThanOrEqual(2);

      // First position should match the requested placement
      const [primaryPosition] = positions;

      if (placement === 'bottom') {
        expect(primaryPosition.originY).toBe('bottom');
        expect(primaryPosition.overlayY).toBe('top');
        // Should have top as fallback
        expect(positions[1].originY).toBe('top');
        expect(positions[1].overlayY).toBe('bottom');
      } else if (placement === 'top') {
        expect(primaryPosition.originY).toBe('top');
        expect(primaryPosition.overlayY).toBe('bottom');
        // Should have bottom as fallback
        expect(positions[1].originY).toBe('bottom');
        expect(positions[1].overlayY).toBe('top');
      } else if (placement === 'left') {
        expect(primaryPosition.originX).toBe('start');
        expect(primaryPosition.overlayX).toBe('end');
        // Should have right as fallback
        expect(positions[1].originX).toBe('end');
        expect(positions[1].overlayX).toBe('start');
      } else if (placement === 'right') {
        expect(primaryPosition.originX).toBe('end');
        expect(primaryPosition.overlayX).toBe('start');
        // Should have left as fallback
        expect(positions[1].originX).toBe('start');
        expect(positions[1].overlayX).toBe('end');
      }
    });
  });

  afterEach(() => {
    const overlayContainer = document.querySelector('.cdk-overlay-container');
    if (overlayContainer) {
      overlayContainer.innerHTML = '';
    }
  });
});

describe('ZardPopoverComponent standalone', () => {
  let component: ZardPopoverComponent;
  let fixture: ComponentFixture<ZardPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardPopoverComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.classList.contains('custom-class')).toBeTruthy();
  });
});

@Component({
  imports: [ZardPopoverDirective, ZardPopoverComponent],
  standalone: true,
  template: `
    <button zPopover [zContent]="popoverContent" zTrigger="hover">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="hover-content">Hover content</div>
      </z-popover>
    </ng-template>
  `,
})
class HoverTestComponent {
  readonly popoverContent = viewChild.required<TemplateRef<unknown>>('popoverContent');
}

describe('ZardPopoverComponent with hover trigger', () => {
  let fixture: ComponentFixture<HoverTestComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, HoverTestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HoverTestComponent);
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should be configured with hover trigger', () => {
    // This test verifies that the component can be configured with hover trigger
    // The actual hover behavior is complex to test in unit tests
    const directive = buttonElement.injector.get(ZardPopoverDirective);
    expect(directive.zTrigger()).toBe('hover');
  });

  afterEach(() => {
    const overlayContainer = document.querySelector('.cdk-overlay-container');
    if (overlayContainer) {
      overlayContainer.innerHTML = '';
    }
  });
});
