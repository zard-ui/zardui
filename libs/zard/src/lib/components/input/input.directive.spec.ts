import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardInputDirective } from './input.directive';

@Component({
  template: `<input z-input />`,
  standalone: true,
  imports: [ZardInputDirective],
})
class TestHostComponent {}

describe('InputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    inputElement = fixture.debugElement.query(By.directive(ZardInputDirective));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(inputElement).toBeTruthy();
    expect(inputElement.injector.get(ZardInputDirective)).toBeTruthy();
  });
});
