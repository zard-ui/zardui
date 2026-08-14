import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { type ComponentFixture, type DebugElement, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardNavigationMenuContentDirective } from './navigation-menu-content.directive';

@Component({
  imports: [ZardNavigationMenuContentDirective],
  template: `
    <div z-navigation-menu-content [class]="customClass">Menu Content</div>
  `,
})
class TestComponent {
  customClass = '';
}

describe('ZardNavigationMenuContentDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardNavigationMenuContentDirective;
  let directiveDebugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    directiveDebugElement = fixture.debugElement.query(By.directive(ZardNavigationMenuContentDirective));
    directive = directiveDebugElement.injector.get(ZardNavigationMenuContentDirective);
    element = directiveDebugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should have correct role attribute', () => {
    expect(element.getAttribute('role')).toBe('menu');
  });

  it('should have correct aria-orientation attribute', () => {
    expect(element.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should apply the overlay variant classes when used outside a root', () => {
    expect(element.className).toContain('z-50');
    expect(element.className).toContain('min-w-32');
    expect(element.className).toContain('rounded-lg');
    expect(element.className).toContain('ring-1');
    expect(element.className).toContain('bg-popover');
  });

  it('should not set data-motion outside a root', () => {
    expect(element.getAttribute('data-motion')).toBeNull();
  });

  it('should not trap focus, since a navigation popup is not a modal', () => {
    // Trapping brings auto-capture with it, which on a hover-opened menu drops `focus:bg-muted`
    // and the focus ring onto a link the pointer never touched.
    expect(directiveDebugElement.injector.get(CdkTrapFocus, null)).toBeNull();
  });

  it('should merge custom classes with variant classes', () => {
    component.customClass = 'custom-class';
    fixture.detectChanges();

    expect(element.className).toContain('custom-class');
    expect(element.className).toContain('z-50');
  });

  it('should handle empty custom class', () => {
    component.customClass = '';
    fixture.detectChanges();

    expect(element.className).toContain('z-50');
    expect(element.className).not.toContain('undefined');
  });

  it('should update classes when input changes', () => {
    component.customClass = 'first-class';
    fixture.detectChanges();
    expect(element.className).toContain('first-class');

    component.customClass = 'second-class';
    fixture.detectChanges();
    expect(element.className).toContain('second-class');
    expect(element.className).not.toContain('first-class');
  });
});
