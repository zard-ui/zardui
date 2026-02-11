import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';

@Component({
  imports: [ZardDropdownMenuContentComponent],
  standalone: true,
  template: `
    <z-dropdown-menu-content [class]="customClass">
      <div>Menu Content</div>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  customClass = '';
}

describe('ZardDropdownMenuContentComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('hides content with display none', () => {
    const contentElement = fixture.nativeElement.querySelector('z-dropdown-menu-content');
    expect(contentElement).toHaveStyle({ display: 'none' });
  });

  it('receives custom class input', () => {
    const dropdownContentEl = fixture.debugElement.children[0];
    const dropdownContentComponent = dropdownContentEl.componentInstance;

    component.customClass = 'test-class';
    fixture.detectChanges();

    expect(dropdownContentComponent.class()).toBe('test-class');
  });
});

describe('ZardDropdownMenuContentComponent standalone', () => {
  let component: ZardDropdownMenuContentComponent;
  let fixture: ComponentFixture<ZardDropdownMenuContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDropdownMenuContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardDropdownMenuContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('exposes contentTemplate', () => {
    expect(component.contentTemplate).toBeTruthy();
  });

  it('exports as zDropdownMenuContent', () => {
    expect(fixture.componentInstance).toBeInstanceOf(ZardDropdownMenuContentComponent);
  });
});
