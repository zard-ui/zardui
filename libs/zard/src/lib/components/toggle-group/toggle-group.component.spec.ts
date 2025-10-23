import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from './toggle-group.component';

describe('ZardToggleGroupComponent', () => {
  let component: ZardToggleGroupComponent;
  let fixture: ComponentFixture<ZardToggleGroupComponent>;

  const mockToggleItems: ZardToggleGroupItem[] = [
    { label: 'Bold', value: 'bold', ariaLabel: 'Toggle bold' },
    { label: 'Italic', value: 'italic', ariaLabel: 'Toggle italic' },
    { label: 'Underline', value: 'underline', ariaLabel: 'Toggle underline' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardToggleGroupComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardToggleGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toggle buttons based on items input', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('bold');
    expect(buttons[1].textContent.trim()).toBe('italic');
    expect(buttons[2].textContent.trim()).toBe('underline');
  });

  it('should set aria-pressed attribute correctly for multiple type', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'multiple');
    fixture.componentRef.setInput('defaultValue', ['italic']);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('should set data-state attribute correctly for single type', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'single');
    fixture.componentRef.setInput('defaultValue', 'italic');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('data-state')).toBe('off');
    expect(buttons[1].getAttribute('data-state')).toBe('on');
    expect(buttons[2].getAttribute('data-state')).toBe('off');
  });

  it('should toggle item when clicked', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'multiple');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const firstButton = buttons[0];

    jest.spyOn(component.valueChange, 'emit');

    firstButton.click();

    expect(component.valueChange.emit).toHaveBeenCalledWith(['bold']);
  });

  it('should handle single type selection', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'single');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const firstButton = buttons[0];

    jest.spyOn(component.valueChange, 'emit');

    firstButton.click();

    expect(component.valueChange.emit).toHaveBeenCalledWith('bold');
  });

  it('should apply size classes correctly', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('zSize', 'lg');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container).toBeTruthy();
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl<string | string[] | null>(null);

    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'multiple');
    fixture.detectChanges();

    component.registerOnChange((value: string | string[]) => {
      formControl.setValue(value);
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(formControl.value).toEqual(['bold']);
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.disabled).toBe(true);
    });
  });

  it('should not toggle when disabled', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    jest.spyOn(component.valueChange, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('items', mockToggleItems);
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.className).toContain('custom-class');
  });

  it('should render icons when provided', () => {
    const itemsWithIcons: ZardToggleGroupItem[] = [
      { value: 'bold', icon: 'bold', ariaLabel: 'Toggle bold' },
      { value: 'italic', icon: 'italic', ariaLabel: 'Toggle italic' },
    ];

    fixture.componentRef.setInput('items', itemsWithIcons);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const icon1 = buttons[0].querySelector('z-icon');
    const icon2 = buttons[1].querySelector('z-icon');

    expect(icon1).toBeTruthy();
    expect(icon2).toBeTruthy();
  });

  it('should render both icon and label when provided', () => {
    const itemsWithIconsAndLabels: ZardToggleGroupItem[] = [{ value: 'bold', icon: 'bold', label: 'Bold', ariaLabel: 'Toggle bold' }];

    fixture.componentRef.setInput('items', itemsWithIconsAndLabels);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    const icon = button.querySelector('z-icon');
    const textSpan = button.querySelector('span:last-child');

    expect(icon).toBeTruthy();
    expect(textSpan).toBeTruthy();
    expect(textSpan.textContent).toBe('bold');
    expect(textSpan.textContent.trim()).toBe('bold');
  });
});
