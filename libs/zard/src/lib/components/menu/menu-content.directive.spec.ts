import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardMenuContentDirective } from './menu-content.directive';

@Component({
  template: `<div z-menu-content [class]="customClass">Menu Content</div>`,
  imports: [ZardMenuContentDirective],
})
class TestComponent {
  customClass = '';
}

describe('ZardMenuContentDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: ZardMenuContentDirective;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    const directiveDebugElement = fixture.debugElement.query(By.directive(ZardMenuContentDirective));
    directive = directiveDebugElement.injector.get(ZardMenuContentDirective);
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

  it('should apply default variant classes', () => {
    expect(element.className).toContain('z-50');
    expect(element.className).toContain('min-w-[8rem]');
    expect(element.className).toContain('rounded-md');
    expect(element.className).toContain('border');
    expect(element.className).toContain('bg-popover');
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
