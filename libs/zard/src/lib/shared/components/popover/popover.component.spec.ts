import { OverlayModule } from '@angular/cdk/overlay';
import { Component, type DebugElement, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import {
  ZARD_POPOVER_ANIMATION_DURATION,
  ZardPopoverComponent,
  ZardPopoverDescriptionComponent,
  ZardPopoverDirective,
  ZardPopoverHeaderComponent,
  ZardPopoverTitleComponent,
  type ZardPopoverAlign,
  type ZardPopoverPlacement,
} from './popover.component';

function queryContent(): HTMLElement | null {
  return document.querySelector('.cdk-overlay-container #test-content');
}

function queryPopover(): HTMLElement | null {
  return document.querySelector('.cdk-overlay-container [data-slot="popover-content"]');
}

@Component({
  imports: [ZardPopoverDirective, ZardPopoverComponent],
  template: `
    <button
      type="button"
      zPopover
      [zContent]="popoverContent"
      [zTrigger]="trigger"
      [zPlacement]="placement"
      [zAlign]="align"
      [zSideOffset]="sideOffset"
      [zAlignOffset]="alignOffset"
    >
      Trigger
    </button>

    <ng-template #popoverContent>
      <z-popover>
        <div id="test-content">Test content</div>
      </z-popover>
    </ng-template>
  `,
})
class TestComponent {
  readonly popoverContent = viewChild.required<TemplateRef<unknown>>('popoverContent');
  trigger: 'click' | 'hover' | null = 'click';
  placement: ZardPopoverPlacement = 'bottom';
  align: ZardPopoverAlign = 'center';
  sideOffset = 4;
  alignOffset = 0;
}

describe('ZardPopoverComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let buttonElement: DebugElement;

  // Kept synchronous on purpose: awaiting inside `beforeEach` detaches the NgZone from the ProxyZone that
  // `fakeAsync` delegates to, and timers scheduled from DOM listeners would never reach `tick()`.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, TestComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    });

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

    const popoverContent = queryContent();

    expect(popoverContent).toBeTruthy();
    expect(popoverContent?.textContent).toContain('Test content');
  });

  it('should hide popover on second click', fakeAsync(() => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(queryContent()).toBeTruthy();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();

    expect(queryContent()).toBeFalsy();
  }));

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

    expect(queryContent()).toBeFalsy();
  });

  it('should hide popover on outside click', fakeAsync(() => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(queryContent()).toBeTruthy();

    tick(100);
    document.body.click();
    fixture.detectChanges();

    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();

    expect(queryContent()).toBeFalsy();
  }));

  it('should apply correct placement class', () => {
    component.placement = 'top';
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const overlay = document.querySelector('.cdk-overlay-pane');
    expect(overlay).toBeTruthy();
  });

  it('should support all placement options', fakeAsync(() => {
    const placements: ZardPopoverPlacement[] = ['top', 'bottom', 'left', 'right', 'inline-start', 'inline-end'];

    placements.forEach(placement => {
      component.placement = placement;
      fixture.detectChanges();

      buttonElement.nativeElement.click();
      fixture.detectChanges();

      const overlay = document.querySelector('.cdk-overlay-pane');
      expect(overlay).toBeTruthy();

      // Close the popover and let the exit animation finish before the next iteration
      buttonElement.nativeElement.click();
      fixture.detectChanges();
      tick(ZARD_POPOVER_ANIMATION_DURATION);
      fixture.detectChanges();
    });
  }));

  it('should keep popover on scroll', async () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(queryContent()).toBeTruthy();

    // Simulate scroll event
    const scrollEvent = new Event('scroll', { bubbles: true });
    window.dispatchEvent(scrollEvent);
    fixture.detectChanges();

    // Wait for the scroll strategy
    await fixture.whenStable();
    fixture.detectChanges();

    // The popover should remain visible (reposition scroll strategy)
    expect(queryContent()).toBeTruthy();
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
    const placements: ZardPopoverPlacement[] = ['top', 'bottom', 'left', 'right'];

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

  it('should map inline placements onto the logical start/end axis', () => {
    const directive = buttonElement.injector.get(ZardPopoverDirective);

    component.placement = 'inline-start';
    fixture.detectChanges();
    const [inlineStart] = (directive as any).getPositions();
    expect(inlineStart.originX).toBe('start');
    expect(inlineStart.overlayX).toBe('end');

    component.placement = 'inline-end';
    fixture.detectChanges();
    const [inlineEnd] = (directive as any).getPositions();
    expect(inlineEnd.originX).toBe('end');
    expect(inlineEnd.overlayX).toBe('start');
  });

  it('should derive the primary position from zAlign, zSideOffset and zAlignOffset', () => {
    const directive = buttonElement.injector.get(ZardPopoverDirective);

    component.align = 'start';
    component.sideOffset = 12;
    component.alignOffset = 6;
    fixture.detectChanges();

    const [bottomStart] = (directive as any).getPositions();
    expect(bottomStart).toMatchObject({
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 6,
      offsetY: 12,
    });

    component.placement = 'top';
    component.align = 'end';
    fixture.detectChanges();

    const [topEnd] = (directive as any).getPositions();
    expect(topEnd).toMatchObject({
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -12,
    });

    component.placement = 'right';
    component.align = 'start';
    fixture.detectChanges();

    const [rightStart] = (directive as any).getPositions();
    expect(rightStart).toMatchObject({
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 12,
      offsetY: 6,
    });
  });

  it('should default zSideOffset to 4', () => {
    const directive = buttonElement.injector.get(ZardPopoverDirective);
    expect(directive.zSideOffset()).toBe(4);
    expect(directive.zAlignOffset()).toBe(0);
    expect(directive.zAlign()).toBe('center');
  });

  it('should expose data-side, data-align and the transform origin on the content', () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const popover = queryPopover();

    expect(popover).toHaveAttribute('data-slot', 'popover-content');
    expect(popover).toHaveAttribute('data-side', 'bottom');
    expect(popover).toHaveAttribute('data-align', 'center');
    expect(popover?.style.getPropertyValue('--transform-origin')).toBe('center top');
  });

  it('should isolate the overlay panel', () => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const pane = document.querySelector('.cdk-overlay-pane');
    expect(pane?.classList.contains('isolate')).toBe(true);
    expect(pane?.classList.contains('z-50')).toBe(true);
  });

  it('should toggle data-open and data-closed around the exit animation', fakeAsync(() => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    expect(queryPopover()).toHaveAttribute('data-open');
    expect(queryPopover()).not.toHaveAttribute('data-closed');

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    // Still mounted while the exit animation plays
    const closing = queryPopover();
    expect(closing).toBeTruthy();
    expect(closing).toHaveAttribute('data-closed');
    expect(closing).not.toHaveAttribute('data-open');

    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();

    expect(queryPopover()).toBeFalsy();
  }));

  it('should emit zVisibleChange(false) immediately, before the content is detached', fakeAsync(() => {
    const directive = buttonElement.injector.get(ZardPopoverDirective);
    const emitted: boolean[] = [];
    directive.zVisibleChange.subscribe(value => emitted.push(value));

    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(emitted).toEqual([true]);

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    expect(emitted).toEqual([true, false]);
    expect(queryPopover()).toBeTruthy();

    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();
  }));

  it('should reuse the attached content when reopened during the exit animation', fakeAsync(() => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(queryPopover()).toHaveAttribute('data-closed');

    // Reopen while the detach is still pending
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    const contents = document.querySelectorAll('.cdk-overlay-container [data-slot="popover-content"]');
    expect(contents.length).toBe(1);
    expect(contents[0]).toHaveAttribute('data-open');
    expect(contents[0]).not.toHaveAttribute('data-closed');

    // The pending detach must have been cancelled
    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();
    expect(queryPopover()).toBeTruthy();

    buttonElement.nativeElement.click();
    fixture.detectChanges();
    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();
  }));

  it('should not leak a timer when destroyed while closing', fakeAsync(() => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    fixture.destroy();
    // No tick() needed: a pending timer would make fakeAsync fail on exit
  }));

  it('should close on Escape and return focus to the trigger', fakeAsync(() => {
    buttonElement.nativeElement.click();
    fixture.detectChanges();
    expect(queryPopover()).toBeTruthy();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.body.dispatchEvent(event);
    fixture.detectChanges();

    expect(document.activeElement).toBe(buttonElement.nativeElement);
    expect(queryPopover()).toHaveAttribute('data-closed');

    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();
    expect(queryPopover()).toBeFalsy();
  }));

  it('should describe the trigger with the popover a11y attributes', fakeAsync(() => {
    const button = buttonElement.nativeElement as HTMLElement;

    expect(button).toHaveAttribute('data-slot', 'popover-trigger');
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).not.toHaveAttribute('aria-controls');

    button.click();
    fixture.detectChanges();

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button.getAttribute('aria-controls')).toBe(queryPopover()?.getAttribute('id'));

    button.click();
    fixture.detectChanges();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).not.toHaveAttribute('aria-controls');

    tick(ZARD_POPOVER_ANIMATION_DURATION);
    fixture.detectChanges();
  }));

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

  it('should render as a dialog with the popover-content slot', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element).toHaveAttribute('role', 'dialog');
    expect(element).toHaveAttribute('data-slot', 'popover-content');
    expect(element.getAttribute('id')).toBeTruthy();
  });
});

describe('Popover composition parts', () => {
  it('should render header, title and description with their slots', async () => {
    await render(
      `<z-popover>
         <div z-popover-header>
           <h4 z-popover-title>Dimensions</h4>
           <p z-popover-description>Set the dimensions for the layer.</p>
         </div>
       </z-popover>`,
      {
        imports: [
          ZardPopoverComponent,
          ZardPopoverHeaderComponent,
          ZardPopoverTitleComponent,
          ZardPopoverDescriptionComponent,
        ],
      },
    );

    const title = screen.getByText('Dimensions');
    const description = screen.getByText('Set the dimensions for the layer.');

    expect(title).toHaveAttribute('data-slot', 'popover-title');
    expect(description).toHaveAttribute('data-slot', 'popover-description');
    expect(title.parentElement).toHaveAttribute('data-slot', 'popover-header');
  });

  it('should link the content to its title and description', async () => {
    const { container } = await render(
      `<z-popover>
         <div z-popover-header>
           <h4 z-popover-title>Dimensions</h4>
           <p z-popover-description>Set the dimensions for the layer.</p>
         </div>
       </z-popover>`,
      {
        imports: [
          ZardPopoverComponent,
          ZardPopoverHeaderComponent,
          ZardPopoverTitleComponent,
          ZardPopoverDescriptionComponent,
        ],
      },
    );

    const content = container.querySelector('[data-slot="popover-content"]') as HTMLElement;
    const title = screen.getByText('Dimensions');
    const description = screen.getByText('Set the dimensions for the layer.');

    expect(content.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'));
    expect(content.getAttribute('aria-describedby')).toBe(description.getAttribute('id'));
  });

  it('should omit aria-labelledby and aria-describedby when there is no title or description', async () => {
    const { container } = await render(`<z-popover>Plain content</z-popover>`, {
      imports: [ZardPopoverComponent],
    });

    const content = container.querySelector('[data-slot="popover-content"]') as HTMLElement;
    expect(content).not.toHaveAttribute('aria-labelledby');
    expect(content).not.toHaveAttribute('aria-describedby');
  });
});

@Component({
  imports: [ZardPopoverDirective, ZardPopoverComponent],
  template: `
    <button type="button" zPopover [zContent]="popoverContent" zTrigger="hover">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div>Hover content</div>
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
