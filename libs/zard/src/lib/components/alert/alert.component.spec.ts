import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardAlertComponent } from './alert.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert zTitle="Test Title" zDescription="Test Description" zIcon="info" class="custom-class"></z-alert> `,
})
class TestHostComponent {}

describe('ZardAlertComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent));
    expect(alert).toBeTruthy();
  });

  it('should render title and description', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    const titleElement = alert.querySelector('[data-slot="alert-title"]');
    const descriptionElement = alert.querySelector('[data-slot="alert-description"]');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Test Title');
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should apply custom classes', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    expect(alert.classList).toContain('custom-class');
    expect(alert.getAttribute('data-slot')).toBe('alert');
    expect(alert.getAttribute('role')).toBe('alert');
  });
});
