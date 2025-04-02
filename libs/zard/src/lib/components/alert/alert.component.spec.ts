import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardAlertComponent } from './alert.component';

@Component({
  selector: 'test-host-component',
  standalone: true,
  imports: [ZardAlertComponent],
  template: ` <z-alert zTitle="Test Title" zDescription="Test Description" zType="info" zAppearance="outline" class="custom-class"></z-alert> `,
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
    expect(alert.querySelector('h5').textContent).toContain('Test Title');
    expect(alert.querySelector('span').textContent).toContain('Test Description');
  });

  it('should apply default classes', () => {
    const alert = fixture.debugElement.query(By.directive(ZardAlertComponent)).nativeElement;
    expect(alert.classList).toContain('custom-class');
    expect(alert.getAttribute('data-type')).toBe('info');
    expect(alert.getAttribute('data-appearance')).toBe('outline');
  });

  it('should render correct icon based on zType', () => {
    const icon = fixture.debugElement.query(By.css('i'));
    expect(icon.nativeElement.classList).toContain('icon-info');
  });
});
