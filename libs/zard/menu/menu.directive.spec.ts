import { PARENT_OR_NEW_MENU_STACK_PROVIDER } from '@angular/cdk/menu';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardMenuDirective } from './menu.directive';

@Component({
  imports: [ZardMenuDirective],
  template: `
    <button z-menu [zMenuTriggerFor]="menuPanel" [zDisabled]="disabled" [zTrigger]="trigger" [zHoverDelay]="hoverDelay">
      Trigger
    </button>
    <div #menuPanel></div>
  `,
})
class TestComponent {
  disabled = false;
  trigger: 'click' | 'hover' = 'click';
  hoverDelay = 100;
}

describe('ZardMenuDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardMenuDirective;
  let triggerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [PARENT_OR_NEW_MENU_STACK_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    const directiveDebugElement = fixture.debugElement.query(By.directive(ZardMenuDirective));
    directive = directiveDebugElement.injector.get(ZardMenuDirective);
    triggerElement = directiveDebugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should have correct initial attributes', () => {
    expect(triggerElement.getAttribute('role')).toBe('button');
    expect(triggerElement.getAttribute('aria-haspopup')).toBe('menu');
    expect(triggerElement.style.cursor).toBe('pointer');
  });

  it('should reflect disabled state', () => {
    expect(triggerElement.getAttribute('data-disabled')).toBeNull();

    component.disabled = true;
    fixture.detectChanges();

    expect(triggerElement.getAttribute('data-disabled')).toBe('');
  });

  it('should handle click trigger by default', () => {
    expect(directive['zTrigger']()).toBe('click');
  });

  it('should handle hover trigger', () => {
    component.trigger = 'hover';
    fixture.detectChanges();

    expect(directive['zTrigger']()).toBe('hover');
  });

  it('should set hover delay', () => {
    component.hoverDelay = 200;
    fixture.detectChanges();

    expect(directive['zHoverDelay']()).toBe(200);
  });

  it('should open menu on mouseenter when hover trigger is enabled', () => {
    component.trigger = 'hover';
    fixture.detectChanges();

    const cdkTrigger = directive['cdkTrigger'];
    jest.spyOn(cdkTrigger, 'open').mockImplementation(() => {
      // Mock implementation for testing
    });

    directive.ngOnInit();

    const mouseEnterEvent = new MouseEvent('mouseenter');
    triggerElement.dispatchEvent(mouseEnterEvent);

    expect(cdkTrigger.open).toHaveBeenCalled();
  });

  it('should not open menu on mouseenter when disabled', () => {
    component.trigger = 'hover';
    component.disabled = true;
    fixture.detectChanges();

    const cdkTrigger = directive['cdkTrigger'];
    jest.spyOn(cdkTrigger, 'open');

    directive.ngOnInit();

    const mouseEnterEvent = new MouseEvent('mouseenter');
    triggerElement.dispatchEvent(mouseEnterEvent);

    expect(cdkTrigger.open).not.toHaveBeenCalled();
  });

  it('should schedule close on mouseleave when hover trigger is enabled', done => {
    component.trigger = 'hover';
    component.hoverDelay = 50;
    fixture.detectChanges();

    const cdkTrigger = directive['cdkTrigger'];
    jest.spyOn(cdkTrigger, 'close');

    directive.ngOnInit();

    const mouseLeaveEvent = new MouseEvent('mouseleave', { relatedTarget: null });
    triggerElement.dispatchEvent(mouseLeaveEvent);

    setTimeout(() => {
      expect(cdkTrigger.close).toHaveBeenCalled();
      done();
    }, 60);
  });

  it('should cancel scheduled close on mouseenter', () => {
    component.trigger = 'hover';
    fixture.detectChanges();

    const cdkTrigger = directive['cdkTrigger'];
    jest.spyOn(cdkTrigger, 'open').mockImplementation(() => {
      // Mock implementation for testing
    });

    directive.ngOnInit();
    directive['scheduleMenuClose']();

    expect(directive['closeTimeout']).not.toBeNull();

    const mouseEnterEvent = new MouseEvent('mouseenter');
    triggerElement.dispatchEvent(mouseEnterEvent);

    expect(directive['closeTimeout']).toBeNull();
  });

  it('should clean up on destroy', () => {
    component.trigger = 'hover';
    fixture.detectChanges();

    directive.ngOnInit();
    directive['scheduleMenuClose']();

    expect(directive['closeTimeout']).not.toBeNull();
    expect(directive['cleanupFunctions'].length).toBeGreaterThan(0);

    directive.ngOnDestroy();

    expect(directive['closeTimeout']).toBeNull();
    expect(directive['cleanupFunctions'].length).toBe(0);
  });

  it('should determine if menu should stay open based on related target', () => {
    const mockTriggerElement = document.createElement('div');
    const mockOverlayPane = document.createElement('div');
    mockOverlayPane.className = 'cdk-overlay-pane';
    const mockMenuElement = document.createElement('div');
    mockMenuElement.setAttribute('z-menu-content', '');
    mockOverlayPane.appendChild(mockMenuElement);

    jest
      .spyOn(directive['elementRef'].nativeElement, 'contains')
      .mockImplementation(element => element === mockTriggerElement);

    expect(directive['shouldKeepMenuOpen'](null)).toBe(false);
    expect(directive['shouldKeepMenuOpen'](mockTriggerElement)).toBe(true);
    expect(directive['shouldKeepMenuOpen'](mockMenuElement)).toBe(true);
  });
});
