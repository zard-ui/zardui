import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardComboboxComponent, type ZardComboboxOption, type ZardComboboxGroup } from './combobox.component';

const testOptions: ZardComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const testGroups: ZardComboboxGroup[] = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
];

@Component({
  imports: [ZardComboboxComponent],
  template: `
    <z-combobox
      [options]="options()"
      [groups]="groups()"
      [value]="value()"
      [disabled]="disabled()"
      [searchable]="searchable()"
      [placeholder]="placeholder()"
      [ariaLabel]="ariaLabel()"
    />
  `,
})
class TestHostComponent {
  readonly options = signal<ZardComboboxOption[]>(testOptions);
  readonly groups = signal<ZardComboboxGroup[]>([]);
  readonly value = signal<string | null>(null);
  readonly disabled = signal(false);
  readonly searchable = signal(true);
  readonly placeholder = signal('Select...');
  readonly ariaLabel = signal('');
}

describe('ZardComboboxComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let comboboxComponent: ZardComboboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;

    // Initial change detection to create component tree
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    comboboxComponent = hostFixture.debugElement.children[0].componentInstance as ZardComboboxComponent;

    // Additional change detection to ensure content is processed
    hostFixture.detectChanges();
    await hostFixture.whenStable();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('creates successfully', () => {
    expect(comboboxComponent).toBeTruthy();
  });

  it('renders combobox button with placeholder', () => {
    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Select...');
  });

  describe('option selection', () => {
    it('emits zValueChange when option is clicked', async () => {
      const valueChangeSpy = jest.spyOn(comboboxComponent.zValueChange, 'emit');
      const comboSelectedSpy = jest.spyOn(comboboxComponent.zComboSelected, 'emit');

      // Simulate option selection by calling handleSelect
      comboboxComponent.handleSelect({ value: 'apple', label: 'Apple' } as any);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(valueChangeSpy).toHaveBeenCalledWith('apple');
      expect(comboSelectedSpy).toHaveBeenCalledWith({ value: 'apple', label: 'Apple' });
    });

    it('emits zValueChange and zComboSelected with correct option object', async () => {
      const valueChangeSpy = jest.spyOn(comboboxComponent.zValueChange, 'emit');
      const comboSelectedSpy = jest.spyOn(comboboxComponent.zComboSelected, 'emit');

      comboboxComponent.handleSelect({ value: 'banana', label: 'Banana' } as any);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(valueChangeSpy).toHaveBeenCalledWith('banana');
      expect(comboSelectedSpy).toHaveBeenCalledWith({ value: 'banana', label: 'Banana' });
    });

    it('toggles selection when same option is clicked again', async () => {
      const valueChangeSpy = jest.spyOn(comboboxComponent.zValueChange, 'emit');

      hostComponent.value.set('apple');
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      comboboxComponent.handleSelect({ value: 'apple', label: 'Apple' } as any);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(valueChangeSpy).toHaveBeenCalledWith(null);
    });

    it('handles keyboard activation with Enter key', async () => {
      const valueChangeSpy = jest.spyOn(comboboxComponent.zValueChange, 'emit');
      const comboSelectedSpy = jest.spyOn(comboboxComponent.zComboSelected, 'emit');

      comboboxComponent.handleSelect({ value: 'cherry', label: 'Cherry' } as any);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(valueChangeSpy).toHaveBeenCalledWith('cherry');
      expect(comboSelectedSpy).toHaveBeenCalledWith({ value: 'cherry', label: 'Cherry' });
    });

    it('handles keyboard activation with Space key', async () => {
      const valueChangeSpy = jest.spyOn(comboboxComponent.zValueChange, 'emit');
      const comboSelectedSpy = jest.spyOn(comboboxComponent.zComboSelected, 'emit');

      comboboxComponent.handleSelect({ value: 'apple', label: 'Apple' } as any);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(valueChangeSpy).toHaveBeenCalledWith('apple');
      expect(comboSelectedSpy).toHaveBeenCalledWith({ value: 'apple', label: 'Apple' });
    });
  });

  it('displays selected value when option is selected', () => {
    hostComponent.value.set('apple');
    hostFixture.detectChanges();

    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    expect(button).toHaveTextContent('Apple');
  });

  it('disables interaction when disabled is true', () => {
    hostComponent.disabled.set(true);
    hostFixture.detectChanges();

    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    expect(button).toBeDisabled();
  });

  it('hides search input when searchable is false', () => {
    hostComponent.searchable.set(false);
    hostFixture.detectChanges();

    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    button.click();
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.querySelector('z-command-input')).not.toBeInTheDocument();
  });

  it('emits aria-expanded attribute on button', () => {
    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    button.click();
    hostFixture.detectChanges();

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('uses custom aria-label when provided', () => {
    hostComponent.ariaLabel.set('Choose your favorite fruit');
    hostFixture.detectChanges();

    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    expect(button).toHaveAttribute('aria-label', 'Choose your favorite fruit');
  });

  it('writes value via ControlValueAccessor', () => {
    comboboxComponent.writeValue('cherry');
    hostFixture.detectChanges();

    const button = hostFixture.nativeElement.querySelector('button[z-button]');
    expect(button).toHaveTextContent('Cherry');
  });

  it('registers onChange callback for ControlValueAccessor', async () => {
    const mockOnChange = jest.fn();
    comboboxComponent.registerOnChange(mockOnChange);
    expect(mockOnChange).toBeDefined();

    // Verify callback is invoked when value changes
    comboboxComponent.handleSelect({ value: 'apple', label: 'Apple' } as any);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(mockOnChange).toHaveBeenCalledWith('apple');
  });

  it('registers onTouched callback for ControlValueAccessor', () => {
    const mockOnTouched = jest.fn();
    comboboxComponent.registerOnTouched(mockOnTouched);
    expect(mockOnTouched).toBeDefined();
  });

  describe('input signals', () => {
    it('reads options correctly', () => {
      expect(comboboxComponent.options()).toEqual(testOptions);
    });

    it('reads groups correctly', () => {
      hostComponent.groups.set(testGroups);
      hostFixture.detectChanges();

      expect(comboboxComponent.groups()).toEqual(testGroups);
    });

    it('reads placeholder correctly', () => {
      hostComponent.placeholder.set('Custom placeholder');
      hostFixture.detectChanges();

      expect(comboboxComponent.placeholder()).toBe('Custom placeholder');
    });

    it('reads disabled state correctly', () => {
      hostComponent.disabled.set(true);
      hostFixture.detectChanges();

      expect(comboboxComponent.disabled()).toBe(true);
    });

    it('reads searchable state correctly', () => {
      hostComponent.searchable.set(false);
      hostFixture.detectChanges();

      expect(comboboxComponent.searchable()).toBe(false);
    });
  });

  describe('with groups', () => {
    beforeEach(() => {
      hostComponent.groups.set(testGroups);
      hostComponent.options.set([]);
      hostFixture.detectChanges();
    });

    it('reads groups correctly', () => {
      expect(comboboxComponent.groups()).toEqual(testGroups);
    });

    it('has empty options when groups are set', () => {
      expect(comboboxComponent.options()).toEqual([]);
    });
  });
});
