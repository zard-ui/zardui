import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardCommandOptionGroupComponent } from './command-option-group.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardCommandOptionGroupComponent],
  template: `
    <z-command-option-group zLabel="Test Group" class="custom-class">
      <div>Content</div>
    </z-command-option-group>
  `,
})
class TestHostComponent {}

describe('ZardCommandOptionGroupComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ZardCommandOptionGroupComponent;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement.query(By.directive(ZardCommandOptionGroupComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render group label', () => {
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Test Group');
  });

  it('should render content', () => {
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Content');
  });

  it('should have proper ARIA roles', () => {
    const groupElements = fixture.nativeElement.querySelectorAll('[role="group"]');
    expect(groupElements.length).toBeGreaterThan(0);
  });

  it('should apply custom classes', () => {
    const element = fixture.nativeElement.querySelector('[role="group"]');
    expect(element.className).toContain('custom-class');
  });
});
