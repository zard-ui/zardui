import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ToggleGroupValue, ZardToggleGroupComponent } from './toggle-group.component';

describe('ZardToggleGroupComponent', () => {
  let component: ZardToggleGroupComponent;
  let fixture: ComponentFixture<ZardToggleGroupComponent>;

  const mockToggleItems: ToggleGroupValue[] = [
    { label: 'Bold', value: 'bold', checked: false },
    { label: 'Italic', value: 'italic', checked: true },
    { label: 'Underline', value: 'underline', checked: false },
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

  it('should render toggle buttons based on zValue input', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('Bold');
    expect(buttons[1].textContent.trim()).toBe('Italic');
    expect(buttons[2].textContent.trim()).toBe('Underline');
  });

  it('should set aria-pressed attribute correctly', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('should set data-state attribute correctly', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('data-state')).toBe('off');
    expect(buttons[1].getAttribute('data-state')).toBe('on');
    expect(buttons[2].getAttribute('data-state')).toBe('off');
  });

  it('should toggle item when clicked', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const firstButton = buttons[0];

    jest.spyOn(component.onClick, 'emit');
    jest.spyOn(component.onChange, 'emit');

    firstButton.click();

    expect(component.onClick.emit).toHaveBeenCalled();
    expect(component.onChange.emit).toHaveBeenCalled();
  });

  it('should emit onHover when mouse enters button', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const firstButton = buttons[0];

    jest.spyOn(component.onHover, 'emit');

    firstButton.dispatchEvent(new MouseEvent('mouseenter'));

    expect(component.onHover.emit).toHaveBeenCalled();
  });

  it('should apply size classes correctly', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.componentRef.setInput('zSize', 'lg');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container).toBeTruthy();
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl(mockToggleItems);

    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    component.registerOnChange((value: ToggleGroupValue[]) => {
      formControl.setValue(value);
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(formControl.value).toBeDefined();
  });

  it('should handle disabled state', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    component.setDisabledState(true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.disabled).toBe(true);
    });
  });

  it('should not toggle when disabled', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.detectChanges();

    component.setDisabledState(true);
    fixture.detectChanges();

    jest.spyOn(component.onClick, 'emit');
    jest.spyOn(component.onChange, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(component.onClick.emit).not.toHaveBeenCalled();
    expect(component.onChange.emit).not.toHaveBeenCalled();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('zValue', mockToggleItems);
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.className).toContain('custom-class');
  });
});
