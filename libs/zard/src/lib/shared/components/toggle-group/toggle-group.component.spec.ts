import { Component, computed, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic } from '@ng-icons/lucide';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

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
    })
      .overrideComponent(ZardToggleGroupComponent, {
        set: { viewProviders: [provideIcons({ lucideItalic, lucideBold })] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ZardToggleGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toggle buttons based on items input', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('Bold');
    expect(buttons[1].textContent.trim()).toBe('Italic');
    expect(buttons[2].textContent.trim()).toBe('Underline');
  });

  it('should set aria-pressed attribute correctly for multiple type', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'multiple');
    fixture.componentRef.setInput('zValue', ['italic']);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('should set data-state attribute correctly for single type', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'single');
    fixture.componentRef.setInput('zValue', 'italic');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('data-state')).toBe('off');
    expect(buttons[1].getAttribute('data-state')).toBe('on');
    expect(buttons[2].getAttribute('data-state')).toBe('off');
  });

  it('should toggle item when clicked', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'multiple');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const firstButton = buttons[0];

    jest.spyOn(component.valueChange, 'emit');

    firstButton.click();

    expect(component.valueChange.emit).toHaveBeenCalledWith(['bold']);
  });

  it('should handle single type selection', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'single');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const firstButton = buttons[0];

    jest.spyOn(component.valueChange, 'emit');

    firstButton.click();

    expect(component.valueChange.emit).toHaveBeenCalledWith('bold');
  });

  it('should apply size classes correctly', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zSize', 'lg');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container).toBeTruthy();
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl<string | string[] | null>(null);

    fixture.componentRef.setInput('zItems', mockToggleItems);
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
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zDisabled', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.disabled).toBe(true);
    });
  });

  it('should not toggle when disabled', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zDisabled', true);
    fixture.detectChanges();

    jest.spyOn(component.valueChange, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should apply custom classes', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.className).toContain('custom-class');
  });

  it('should render icons when provided', () => {
    const itemsWithIcons: ZardToggleGroupItem[] = [
      { value: 'bold', icon: 'lucideBold', ariaLabel: 'Toggle bold' },
      { value: 'italic', icon: 'lucideItalic', ariaLabel: 'Toggle italic' },
    ];

    fixture.componentRef.setInput('zItems', itemsWithIcons);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const icon1 = buttons[0].querySelector('ng-icon');
    const icon2 = buttons[1].querySelector('ng-icon');

    expect(icon1).toBeTruthy();
    expect(icon2).toBeTruthy();
  });

  it('should render both icon and label when provided', () => {
    const itemsWithIconsAndLabels: ZardToggleGroupItem[] = [
      { value: 'bold', icon: 'lucideBold', label: 'Bold', ariaLabel: 'Toggle bold' },
    ];

    fixture.componentRef.setInput('zItems', itemsWithIconsAndLabels);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    const icon = button.querySelector('ng-icon');
    const textSpan = button.querySelector('span:last-child');

    expect(icon).toBeTruthy();
    expect(textSpan).toBeTruthy();
    expect(textSpan.textContent).toBe('Bold');
    expect(textSpan.textContent.trim()).toBe('Bold');
  });

  it('should set data-orientation to horizontal by default', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.getAttribute('data-orientation')).toBe('horizontal');
    expect(container.hasAttribute('data-horizontal')).toBe(true);
    expect(container.hasAttribute('data-vertical')).toBe(false);
  });

  it('should set data-orientation to vertical and add data-vertical attribute', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zOrientation', 'vertical');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.getAttribute('data-orientation')).toBe('vertical');
    expect(container.hasAttribute('data-vertical')).toBe(true);
    expect(container.hasAttribute('data-horizontal')).toBe(false);
  });

  it('should set spacing attribute and --gap CSS variable', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zSpacing', 2);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.getAttribute('data-spacing')).toBe('2');
    expect(container.style.getPropertyValue('--gap')).toBe('2');
  });

  it('should set spacing attribute to 0 by default', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.getAttribute('data-spacing')).toBe('0');
    expect(container.style.getPropertyValue('--gap')).toBe('0');
  });

  it('should apply data-variant and data-size attributes on items', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zType', 'outline');
    fixture.componentRef.setInput('zSize', 'lg');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as HTMLButtonElement[];
    buttons.forEach(button => {
      expect(button.getAttribute('data-variant')).toBe('outline');
      expect(button.getAttribute('data-size')).toBe('lg');
    });
  });

  it('should disable individual items via item.disabled', () => {
    const itemsWithDisabled: ZardToggleGroupItem[] = [
      { value: 'bold', label: 'Bold', ariaLabel: 'Toggle bold' },
      { value: 'italic', label: 'Italic', ariaLabel: 'Toggle italic', disabled: true },
      { value: 'underline', label: 'Underline', ariaLabel: 'Toggle underline' },
    ];

    fixture.componentRef.setInput('zItems', itemsWithDisabled);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
    expect(buttons[2].disabled).toBe(false);
  });

  it('should not toggle when individual item is disabled', () => {
    const itemsWithDisabled: ZardToggleGroupItem[] = [
      { value: 'bold', label: 'Bold', ariaLabel: 'Toggle bold' },
      { value: 'italic', label: 'Italic', ariaLabel: 'Toggle italic', disabled: true },
    ];

    fixture.componentRef.setInput('zItems', itemsWithDisabled);
    fixture.detectChanges();

    jest.spyOn(component.valueChange, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should toggle off in single mode when clicking the active item', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'single');
    fixture.componentRef.setInput('zValue', 'bold');
    fixture.detectChanges();

    jest.spyOn(component.valueChange, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(component.valueChange.emit).toHaveBeenCalledWith('');
  });

  it('should toggle off in multiple mode when clicking an active item', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zMode', 'multiple');
    fixture.componentRef.setInput('zValue', ['bold', 'italic']);
    fixture.detectChanges();

    jest.spyOn(component.valueChange, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(component.valueChange.emit).toHaveBeenCalledWith(['italic']);
  });

  it('should render value as text when no icon or label is provided', () => {
    const itemsWithoutLabels: ZardToggleGroupItem[] = [{ value: 'bold', ariaLabel: 'Toggle bold' }];

    fixture.componentRef.setInput('zItems', itemsWithoutLabels);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('bold');
  });

  it('should set aria-label from item.ariaLabel', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-label')).toBe('Toggle bold');
    expect(buttons[1].getAttribute('aria-label')).toBe('Toggle italic');
  });

  it('should set data-slot attributes on container and items', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="group"]');
    expect(container.getAttribute('data-slot')).toBe('toggle-group');

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].getAttribute('data-slot')).toBe('toggle-group-item');
  });

  it('should render custom template when provided', () => {
    const testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostFixture.detectChanges();

    const buttons = testHostFixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    const firstButtonContent = buttons[0].textContent;
    const secondButtonContent = buttons[1].textContent;

    expect(firstButtonContent).toContain('Custom A');
    expect(firstButtonContent).toContain('Label A');
    expect(secondButtonContent).toContain('Custom B');
    expect(secondButtonContent).toContain('Label B');
  });

  it('should apply zItemClass to individual toggle items', () => {
    fixture.componentRef.setInput('zItems', mockToggleItems);
    fixture.componentRef.setInput('zItemClass', 'w-full');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.className).toContain('w-full');
    });
  });

  it('should render template instead of icon and label when both are provided', () => {
    const testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostFixture.detectChanges();

    const buttons = testHostFixture.nativeElement.querySelectorAll('button');
    const firstButtonIcon = buttons[0].querySelector('ng-icon');
    const buttonSpans = buttons[0].querySelectorAll('span');

    expect(firstButtonIcon).toBeNull();
    expect(buttonSpans.length).toBe(2);
  });

  it('should toggle item with custom template', () => {
    const testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostFixture.detectChanges();

    const component = testHostFixture.componentInstance.toggleGroupComponent();

    jest.spyOn(component.valueChange, 'emit');

    const buttons = testHostFixture.nativeElement.querySelectorAll('button');
    buttons[0].click();

    expect(component.valueChange.emit).toHaveBeenCalledWith('item-a');
  });
});

@Component({
  selector: 'test-host',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group [zItems]="items()" zMode="single" />
    <ng-template #templateA>
      <span>Custom A</span>
      <span>Label A</span>
    </ng-template>
    <ng-template #templateB>
      <span>Custom B</span>
      <span>Label B</span>
    </ng-template>
  `,
})
class TestHostComponent {
  readonly templateA = viewChild.required<TemplateRef<void>>('templateA');
  readonly templateB = viewChild.required<TemplateRef<void>>('templateB');

  readonly toggleGroupComponent = viewChild.required(ZardToggleGroupComponent);

  readonly items = computed<ZardToggleGroupItem[]>(() => [
    {
      value: 'item-a',
      template: this.templateA(),
      ariaLabel: 'Item A',
    },
    {
      value: 'item-b',
      template: this.templateB(),
      ariaLabel: 'Item B',
    },
  ]);
}
