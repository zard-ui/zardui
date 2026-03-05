import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardIconComponent } from './icon.component';

@Component({
  imports: [ZardIconComponent],
  standalone: true,
  template: `
    <z-icon [zType]="iconType" [zSize]="size" />
  `,
})
class TestHostComponent {
  iconType: 'house' | 'chevron-down' = 'house';
  size: 'sm' | 'default' | 'lg' | 'xl' = 'default';
}

describe('ZardIconComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardIconComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders icon with default size class on host element', () => {
    const zIconElement = fixture.nativeElement.querySelector('z-icon');
    expect(zIconElement).toBeTruthy();
    expect(zIconElement.classList.contains('size-3.5')).toBe(true);
  });

  it('applies custom size class on host element when size changes', () => {
    component.size = 'lg';
    fixture.detectChanges();

    const zIconElement = fixture.nativeElement.querySelector('z-icon');
    expect(zIconElement.classList.contains('size-4')).toBe(true);
  });

  it('should render ng-icon component', () => {
    const ngIcon = fixture.nativeElement.querySelector('ng-icon');
    expect(ngIcon).toBeTruthy();
  });

  it('should change icon type', () => {
    component.iconType = 'chevron-down';
    fixture.detectChanges();
    expect(component.iconType).toBe('chevron-down');
  });
});
