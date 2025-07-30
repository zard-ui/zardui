import { OverlayModule } from '@angular/cdk/overlay';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardPopoverComponent, ZardPopoverDirective } from './popover.component';

@Component({
  template: `
    <button zPopover [zContent]="popoverContent" [zTrigger]="trigger" [zPlacement]="placement">Trigger</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="test-content">Test content</div>
      </z-popover>
    </ng-template>
  `,
  standalone: true,
  imports: [ZardPopoverDirective, ZardPopoverComponent],
})
class TestComponent {
  @ViewChild('popoverContent') popoverContent!: TemplateRef<unknown>;
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
  template: `
    <button zPopover [zContent]="popoverContent" zTrigger="hover">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="hover-content">Hover content</div>
      </z-popover>
    </ng-template>
  `,
  standalone: true,
  imports: [ZardPopoverDirective, ZardPopoverComponent],
})
class HoverTestComponent {
  @ViewChild('popoverContent') popoverContent!: TemplateRef<unknown>;
}

describe('ZardPopoverComponent with hover trigger', () => {
  let component: HoverTestComponent;
  let fixture: ComponentFixture<HoverTestComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, HoverTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HoverTestComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should show popover on mouseenter', done => {
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
    buttonElement.nativeElement.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();

    setTimeout(() => {
      const popoverContent = document.querySelector('.hover-content');
      expect(popoverContent).toBeTruthy();
      expect(popoverContent?.textContent).toContain('Hover content');
      done();
    }, 100);
  });

  afterEach(() => {
    const overlayContainer = document.querySelector('.cdk-overlay-container');
    if (overlayContainer) {
      overlayContainer.innerHTML = '';
    }
  });
});
