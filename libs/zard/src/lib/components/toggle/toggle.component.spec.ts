import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ZardToggleComponent } from './toggle.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent],
  template: `
    <z-toggle aria-label="Test component" [zValue]="zValue" [zDefault]="zDefault" [disabled]="disabled">
      <div class="icon-bold"></div>
    </z-toggle>
  `,
})
class TestZardToggleComponent {
  zDefault = false;
  disabled = false;
}

describe('ToggleComponent Integration', () => {
  let fixture: ComponentFixture<TestZardToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestZardToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestZardToggleComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render with attributes as off/false by default', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('data-state')).toBe('off');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('Click event should change pressed attributes to true/on', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('data-state')).toBe('on');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('should initialize as active when zDefault="true"', () => {
  let fixture: ComponentFixture<TestZardToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestZardToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestZardToggleComponent);
    const component = fixture.componentInstance;
    component.zDefault = true;
    fixture.detectChanges();
  });

  it('should render with attributes on/true by default', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('data-state')).toBe('on');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('Click event should change attributes back to off/false', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('data-state')).toBe('off');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});

describe('should behave correctly when zDisabled="true"', () => {
  let fixture: ComponentFixture<TestZardToggleComponent>;
  let component: TestZardToggleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestZardToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestZardToggleComponent);
    component = fixture.componentInstance;
    component.disabled = true;
    fixture.detectChanges();
  });

  it('should render with attributes off/false by default', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('data-state')).toBe('off');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('should not toggle the value on click if the toggle is disabled', () => {
    const button = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('data-state')).toBe('off');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
