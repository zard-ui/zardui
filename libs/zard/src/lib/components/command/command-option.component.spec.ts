import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardCommandOptionComponent } from './command-option.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardCommandOptionComponent],
  template: ` <z-command-option zLabel="Test Option" zValue="test-value" zShortcut="⌘K" zIcon="🔍" [zDisabled]="disabled" variant="default"> </z-command-option> `,
})
class TestHostComponent {
  disabled = false;
}

describe('ZardCommandOptionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ZardCommandOptionComponent;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ZardCommandOptionComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label text', () => {
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Test Option');
  });

  it('should show shortcut when provided', () => {
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('⌘K');
  });

  it('should show icon when provided', () => {
    const iconElement = fixture.nativeElement.querySelector('.mr-2');
    expect(iconElement).toBeTruthy();
  });

  it('should apply disabled state', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    const optionElement = fixture.nativeElement.querySelector('[role="option"]');
    expect(optionElement.getAttribute('data-disabled')).toBe('true');
  });

  it('should apply selected state', () => {
    component.setSelected(true);
    fixture.detectChanges();

    const optionElement = fixture.nativeElement.querySelector('[role="option"]');
    expect(optionElement.getAttribute('aria-selected')).toBe('true');
  });

  it('should have proper ARIA attributes', () => {
    const optionElement = fixture.nativeElement.querySelector('[role="option"]');
    expect(optionElement).toBeTruthy();
    expect(optionElement.getAttribute('aria-selected')).toBe('false');
  });

  it('should handle click interaction', () => {
    jest.spyOn(component, 'onClick');
    const optionElement = fixture.nativeElement.querySelector('[role="option"]');

    optionElement.click();
    expect(component.onClick).toHaveBeenCalled();
  });
});
