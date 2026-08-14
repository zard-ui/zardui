import { PARENT_OR_NEW_MENU_STACK_PROVIDER } from '@angular/cdk/menu';
import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardNavigationMenuTriggerDirective } from './navigation-menu-trigger.directive';

@Component({
  imports: [ZardNavigationMenuTriggerDirective],
  template: `
    <button
      z-navigation-menu-trigger
      [zNavigationMenuTriggerFor]="menuPanel"
      [zDisabled]="disabled"
      [zTrigger]="trigger"
      [zHoverDelay]="hoverDelay"
    >
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

describe('ZardNavigationMenuTriggerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardNavigationMenuTriggerDirective;
  let triggerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [PARENT_OR_NEW_MENU_STACK_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    const directiveDebugElement = fixture.debugElement.query(By.directive(ZardNavigationMenuTriggerDirective));
    directive = directiveDebugElement.injector.get(ZardNavigationMenuTriggerDirective);
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

  it('should hand the template to the CDK trigger when used standalone', () => {
    expect(directive['cdkTrigger'].menuTemplateRef).toBe(directive.zNavigationMenuTriggerFor());
  });

  it('should stay visually neutral and chevron-free when used standalone', () => {
    expect(triggerElement.querySelector('ng-icon')).toBeNull();
    expect(triggerElement.className).not.toContain('h-9');
  });

  it('should determine if menu should stay open based on related target', () => {
    const mockTriggerElement = document.createElement('div');
    const mockMenuElement = document.createElement('div');
    mockMenuElement.setAttribute('z-navigation-menu-content', '');
    const mockLink = document.createElement('a');
    mockMenuElement.appendChild(mockLink);
    const outsider = document.createElement('div');

    jest
      .spyOn(directive['elementRef'].nativeElement, 'contains')
      .mockImplementation(element => element === mockTriggerElement);
    // The popup is asked of the CDK trigger rather than queried from the document, so that the
    // shared viewport — which also lives in an overlay pane — cannot be mistaken for it.
    jest.spyOn(directive['cdkTrigger'], 'getMenu').mockReturnValue({ nativeElement: mockMenuElement } as never);

    expect(directive['shouldKeepMenuOpen'](null)).toBe(false);
    expect(directive['shouldKeepMenuOpen'](mockTriggerElement)).toBe(true);
    expect(directive['shouldKeepMenuOpen'](mockLink)).toBe(true);
    expect(directive['shouldKeepMenuOpen'](outsider)).toBe(false);
  });
});
