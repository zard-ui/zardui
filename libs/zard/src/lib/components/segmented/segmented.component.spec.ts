import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentedOption, ZardSegmentedComponent, ZardSegmentedItemComponent } from './segmented.component';

@Component({
  template: `
    <z-segmented
      [zOptions]="options"
      [zDefaultValue]="defaultValue"
      [zDisabled]="disabled"
      (zChange)="onSelectionChange($event)"
    ></z-segmented>
  `,
  standalone: true,
  imports: [ZardSegmentedComponent],
})
class TestHostComponent {
  options: SegmentedOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];
  defaultValue = 'option1';
  disabled = false;
  selectedValue = '';

  onSelectionChange(value: string) {
    this.selectedValue = value;
  }
}

@Component({
  template: `
    <z-segmented>
      <z-segmented-item value="item1" label="Item 1"></z-segmented-item>
      <z-segmented-item value="item2" label="Item 2"></z-segmented-item>
      <z-segmented-item value="item3" label="Item 3" [disabled]="true"></z-segmented-item>
    </z-segmented>
  `,
  standalone: true,
  imports: [ZardSegmentedComponent, ZardSegmentedItemComponent],
})
class TestContentProjectionComponent {}

describe('ZardSegmentedComponent', () => {
  let component: ZardSegmentedComponent;
  let fixture: ComponentFixture<ZardSegmentedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSegmentedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSegmentedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render segments from options array', () => {
    const options: SegmentedOption[] = [
      { value: 'test1', label: 'Test 1' },
      { value: 'test2', label: 'Test 2' },
    ];

    fixture.componentRef.setInput('zOptions', options);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Test 1');
    expect(buttons[1].textContent.trim()).toBe('Test 2');
  });

  it('should handle selection changes', () => {
    const options: SegmentedOption[] = [
      { value: 'test1', label: 'Test 1' },
      { value: 'test2', label: 'Test 2' },
    ];

    fixture.componentRef.setInput('zOptions', options);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.zChange, 'emit');

    const secondButton = fixture.nativeElement.querySelectorAll('button[role="tab"]')[1];
    secondButton.click();

    expect(emitSpy).toHaveBeenCalledWith('test2');
  });

  it('should apply correct ARIA attributes', () => {
    const options: SegmentedOption[] = [
      { value: 'test1', label: 'Test 1' },
      { value: 'test2', label: 'Test 2' },
    ];

    fixture.componentRef.setInput('zOptions', options);
    fixture.componentRef.setInput('zDefaultValue', 'test1');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(container).toBeTruthy();
    expect(container.getAttribute('aria-label')).toBe('Segmented control');

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
  });

  it('should handle disabled state', () => {
    const options: SegmentedOption[] = [
      { value: 'test1', label: 'Test 1' },
      { value: 'test2', label: 'Test 2', disabled: true },
    ];

    fixture.componentRef.setInput('zOptions', options);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]');
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
  });

  it('should disable all segments when zDisabled is true', () => {
    const options: SegmentedOption[] = [
      { value: 'test1', label: 'Test 1' },
      { value: 'test2', label: 'Test 2' },
    ];

    fixture.componentRef.setInput('zOptions', options);
    fixture.componentRef.setInput('zDisabled', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[role="tab"]');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.disabled).toBe(true);
    });
  });

  it('should apply size variants correctly', () => {
    fixture.componentRef.setInput('zSize', 'lg');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(container.className).toContain('h-12');
  });
});

describe('ZardSegmentedComponent with TestHost', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should emit selection changes to host component', () => {
    hostFixture.detectChanges();

    const buttons = hostFixture.nativeElement.querySelectorAll('button[role="tab"]');
    buttons[1].click();

    expect(hostComponent.selectedValue).toBe('option2');
  });

  it('should respect default value', () => {
    hostComponent.defaultValue = 'option2';
    hostFixture.detectChanges();

    const buttons = hostFixture.nativeElement.querySelectorAll('button[role="tab"]');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should not select disabled options', () => {
    hostFixture.detectChanges();

    const buttons = hostFixture.nativeElement.querySelectorAll('button[role="tab"]');
    buttons[2].click(); // Disabled option

    expect(hostComponent.selectedValue).toBe(''); // Should not change
  });
});

describe('ZardSegmentedComponent with Content Projection', () => {
  let hostFixture: ComponentFixture<TestContentProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestContentProjectionComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestContentProjectionComponent);
  });

  it('should render content projected items', () => {
    hostFixture.detectChanges();

    const buttons = hostFixture.nativeElement.querySelectorAll('button[role="tab"]');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('Item 1');
    expect(buttons[1].textContent.trim()).toBe('Item 2');
    expect(buttons[2].textContent.trim()).toBe('Item 3');
  });
});

describe('ZardSegmentedItemComponent', () => {
  let component: ZardSegmentedItemComponent;
  let fixture: ComponentFixture<ZardSegmentedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardSegmentedItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardSegmentedItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept required inputs', () => {
    fixture.componentRef.setInput('value', 'test-value');
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    expect(component.value()).toBe('test-value');
    expect(component.label()).toBe('Test Label');
    expect(component.disabled()).toBe(false);
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(component.disabled()).toBe(true);
  });
});
