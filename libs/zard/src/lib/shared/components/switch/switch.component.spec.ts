import { Component, inject, inputBinding, signal } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule } from '@angular/forms';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardSwitchComponent } from './switch.component';
import { switchVariants } from './switch.variants';

@Component({
  imports: [ZardSwitchComponent],
  template: `
    <z-switch [zChecked]="true">Default Switch</z-switch>
    <z-switch [zChecked]="true" zType="default">Default Type</z-switch>
    <z-switch [zChecked]="true" zType="destructive">Destructive Type</z-switch>

    <z-switch [zChecked]="true" zSize="default">Default Size</z-switch>
    <z-switch [zChecked]="true" zSize="sm">Small Size</z-switch>
    <z-switch [zChecked]="true" zSize="lg">Large Size</z-switch>

    <z-switch [zChecked]="true" zDisabled="true">Disabled Switch</z-switch>
  `,
})
class TestVariantsComponent {}

@Component({
  imports: [ZardSwitchComponent],
  template: `
    <z-switch [(zChecked)]="checked">Toggle</z-switch>
    <p>Status: {{ checked ? 'on' : 'off' }}</p>
  `,
})
class TestNgModelComponent {
  checked = true;
}

@Component({
  imports: [ZardSwitchComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <z-switch formControlName="switch1">Notifications</z-switch>
      <z-switch formControlName="switch2">Dark Mode</z-switch>
      <z-switch formControlName="switch3">Auto Save</z-switch>
    </form>
  `,
})
class TestReactiveFormsComponent {
  private fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      switch1: [false],
      switch2: [true],
      switch3: [{ value: true, disabled: true }],
    });
  }
}

describe('ZardSwitchComponent', () => {
  describe('Basic Rendering', () => {
    it('renders switch with correct role and attributes', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toBeInTheDocument();
      expect(switchButton).toHaveAttribute('type', 'button');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(switchButton).toHaveAttribute('data-state', 'checked');
    });

    it('renders switch with label content', async () => {
      await render(TestVariantsComponent);

      const labels = document.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
      expect(labels[0]).toHaveTextContent('Default Switch');
    });

    it('applies custom classes via class input', async () => {
      const checked = signal(true);
      const customClass = signal('custom-class another-class');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('class', customClass)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('custom-class');
      expect(switchButton).toHaveClass('another-class');
    });
  });

  describe('State Management', () => {
    it('displays checked state when zChecked is true', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(switchButton).toHaveAttribute('data-state', 'checked');
    });

    it('displays unchecked state when zChecked is false', async () => {
      const checked = signal(false);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'false');
      expect(switchButton).toHaveAttribute('data-state', 'unchecked');
    });

    it('toggles state when clicked', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');

      await userEvent.click(switchButton);
      expect(switchButton).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(switchButton);
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
    });

    it('does not toggle when disabled', async () => {
      const checked = signal(true);
      const disabled = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zDisabled', disabled)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(switchButton).toBeDisabled();

      await userEvent.click(switchButton);
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Type Variants', () => {
    it('applies default type variant classes', async () => {
      const checked = signal(true);
      const zType = signal<'default' | 'destructive'>('default');
      const zSize = signal<'default' | 'sm' | 'lg'>('default');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zType', zType), inputBinding('zSize', zSize)],
      });

      const switchButton = screen.getByRole('switch');
      const expectedClasses = switchVariants({ zType: 'default', zSize: 'default' }).split(' ');

      expectedClasses.forEach(cls => {
        expect(switchButton).toHaveClass(cls);
      });
    });

    it('applies destructive type variant classes', async () => {
      const checked = signal(true);
      const zType = signal<'default' | 'destructive'>('destructive');
      const zSize = signal<'default' | 'sm' | 'lg'>('default');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zType', zType), inputBinding('zSize', zSize)],
      });

      const switchButton = screen.getByRole('switch');
      const expectedClasses = switchVariants({ zType: 'destructive', zSize: 'default' }).split(' ');

      expectedClasses.forEach(cls => {
        expect(switchButton).toHaveClass(cls);
      });

      expect(switchButton).toHaveClass('data-[state=checked]:bg-destructive');
    });
  });

  describe('Size Variants', () => {
    it('applies default size classes', async () => {
      const checked = signal(true);
      const zType = signal<'default' | 'destructive'>('default');
      const zSize = signal<'default' | 'sm' | 'lg'>('default');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zType', zType), inputBinding('zSize', zSize)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('h-6');
      expect(switchButton).toHaveClass('w-11');
    });

    it('applies small size classes', async () => {
      const checked = signal(true);
      const zType = signal<'default' | 'destructive'>('default');
      const zSize = signal<'default' | 'sm' | 'lg'>('sm');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zType', zType), inputBinding('zSize', zSize)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('h-5');
      expect(switchButton).toHaveClass('w-9');
    });

    it('applies large size classes', async () => {
      const checked = signal(true);
      const zType = signal<'default' | 'destructive'>('default');
      const zSize = signal<'default' | 'sm' | 'lg'>('lg');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zType', zType), inputBinding('zSize', zSize)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveClass('h-7');
      expect(switchButton).toHaveClass('w-13');
    });

    it('applies correct size attributes to thumb element', async () => {
      const checked = signal(true);
      const zSize = signal<'default' | 'sm' | 'lg'>('lg');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zSize', zSize)],
      });

      const switchButton = screen.getByRole('switch');
      const thumb = switchButton.querySelector('span');
      expect(thumb).toHaveAttribute('data-size', 'lg');
      expect(thumb).toHaveClass('data-[size=lg]:size-6');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when zDisabled is true', async () => {
      const checked = signal(true);
      const disabled = signal(true);

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zDisabled', disabled)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toBeDisabled();
      expect(switchButton).toHaveClass('disabled:cursor-not-allowed');
      expect(switchButton).toHaveClass('disabled:opacity-50');
    });

    it('applies disabled state via setDisabledState', async () => {
      const checked = signal(true);
      const r = await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const component = r.fixture.componentInstance;
      component.setDisabledState(true);
      r.fixture.detectChanges();

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toBeDisabled();
    });

    it('prevents toggle when disabled via setDisabledState', async () => {
      const checked = signal(true);
      const r = await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const component = r.fixture.componentInstance;
      component.setDisabledState(true);
      r.fixture.detectChanges();

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');

      await userEvent.click(switchButton);
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Label Association', () => {
    it('associates label with switch via id', async () => {
      const checked = signal(true);
      const zId = signal('custom-id');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zId', zId)],
      });

      const switchButton = screen.getByRole('switch');
      const label = document.querySelector('label');

      expect(switchButton.id).toBe('custom-id');
      expect(label).toHaveAttribute('for', 'custom-id');
    });

    it('generates unique id when zId is not provided', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      const label = document.querySelector('label');

      expect(switchButton.id).toBeTruthy();
      expect(label).toHaveAttribute('for', switchButton.id);
    });

    it('renders label with fallback content when no content is provided via ng-content', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const label = document.querySelector('label');

      // Label should be present and have fallback content for accessibility
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('toggle switch');
    });
  });

  describe('ControlValueAccessor', () => {
    it('implements writeValue to update checked state', async () => {
      const checked = signal(false);
      const r = await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const component = r.fixture.componentInstance;
      component.writeValue(true);
      r.fixture.detectChanges();

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(switchButton).toHaveAttribute('data-state', 'checked');
    });

    it('calls onChange callback when switch is toggled', async () => {
      const checked = signal(true);
      const r = await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const component = r.fixture.componentInstance;
      const onChangeMock = jest.fn();
      component.registerOnChange(onChangeMock);

      const switchButton = screen.getByRole('switch');
      await userEvent.click(switchButton);

      expect(onChangeMock).toHaveBeenCalledWith(false);
    });

    it('calls onTouched callback when switch is clicked', async () => {
      const checked = signal(true);
      const r = await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const component = r.fixture.componentInstance;
      const onTouchedMock = jest.fn();
      component.registerOnTouched(onTouchedMock);

      const switchButton = screen.getByRole('switch');
      await userEvent.click(switchButton);

      expect(onTouchedMock).toHaveBeenCalled();
    });
  });

  describe('Template-Driven Forms (ngModel)', () => {
    it('binds checked state with ngModel', async () => {
      await render(TestNgModelComponent);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByText('Status: on')).toBeInTheDocument();
    });

    it('updates model when switch is toggled', async () => {
      await render(TestNgModelComponent);

      const switchButton = screen.getByRole('switch');
      await userEvent.click(switchButton);

      expect(switchButton).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByText('Status: off')).toBeInTheDocument();
    });

    it('updates switch when model is changed programmatically', async () => {
      const r = await render(TestNgModelComponent);
      const component = r.fixture.componentInstance;

      component.checked = false;
      r.fixture.detectChanges();

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Reactive Forms', () => {
    let r: Awaited<ReturnType<typeof render<TestReactiveFormsComponent>>>;

    beforeEach(async () => {
      r = await render(TestReactiveFormsComponent);
    });

    it('initializes form controls with correct values', () => {
      const [switch1, switch2, switch3] = screen.getAllByRole('switch');

      expect(switch1).toHaveAttribute('aria-checked', 'false');
      expect(switch2).toHaveAttribute('aria-checked', 'true');
      expect(switch3).toHaveAttribute('aria-checked', 'true');
      expect(switch3).toBeDisabled();
    });

    it('updates form control when switch is toggled', async () => {
      const [switch1, switch2] = screen.getAllByRole('switch');
      const component = r.fixture.componentInstance;

      await userEvent.click(switch1);
      expect(switch1).toHaveAttribute('aria-checked', 'true');
      expect(component.form.get('switch1')?.value).toBe(true);

      await userEvent.click(switch2);
      expect(switch2).toHaveAttribute('aria-checked', 'false');
      expect(component.form.get('switch2')?.value).toBe(false);
    });

    it('updates switch when form control value changes programmatically', () => {
      const [switch1, switch2] = screen.getAllByRole('switch');
      const component = r.fixture.componentInstance;

      component.form.get('switch1')?.setValue(true);
      component.form.get('switch2')?.setValue(false);
      r.fixture.detectChanges();

      expect(switch1).toHaveAttribute('aria-checked', 'true');
      expect(switch2).toHaveAttribute('aria-checked', 'false');
    });

    it('prevents changes to disabled form control', async () => {
      const switch3 = screen.getAllByRole('switch')[2];

      await userEvent.click(switch3);
      expect(switch3).toHaveAttribute('aria-checked', 'true');
      expect(switch3).toBeDisabled();
    });

    it('enables and disables form control', () => {
      const switch3 = screen.getAllByRole('switch')[2];
      const component = r.fixture.componentInstance;
      const control = component.form.get('switch3');

      control?.enable();
      r.fixture.detectChanges();
      expect(switch3).not.toBeDisabled();

      control?.disable();
      r.fixture.detectChanges();
      expect(switch3).toBeDisabled();
    });

    it('toggles from disabled to enabled and back', async () => {
      const switch3 = screen.getAllByRole('switch')[2];
      const component = r.fixture.componentInstance;
      const control = component.form.get('switch3');

      control?.enable();
      r.fixture.detectChanges();
      expect(switch3).not.toBeDisabled();

      await userEvent.click(switch3);
      expect(switch3).toHaveAttribute('aria-checked', 'false');

      control?.disable();
      r.fixture.detectChanges();
      expect(switch3).toBeDisabled();
    });
  });

  describe('Thumb Element', () => {
    it.each([
      ['sm', 'checked', 'data-[size=sm]:data-[state=checked]:translate-x-4'],
      ['default', 'checked', 'data-[state=checked]:translate-x-5'],
      ['lg', 'checked', 'data-[size=lg]:data-[state=checked]:translate-x-6'],
      ['sm', 'unchecked', 'data-[state=unchecked]:translate-x-0'],
      ['default', 'unchecked', 'data-[state=unchecked]:translate-x-0'],
      ['lg', 'unchecked', 'data-[state=unchecked]:translate-x-0'],
    ])('applies correct transform class for size=%s and state=%s', async (zSize, zState, expectedClass) => {
      const checked = signal(zState === 'checked');
      const size = signal<'default' | 'sm' | 'lg'>(zSize as 'default' | 'sm' | 'lg');

      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked), inputBinding('zSize', size)],
      });

      const switchButton = screen.getByRole('switch');
      const thumb = switchButton.querySelector('span');

      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveAttribute('data-size', zSize);
      expect(thumb).toHaveAttribute('data-state', zState);
      expect(thumb).toHaveClass(expectedClass);
    });

    it('renders thumb element with base classes', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      const thumb = switchButton.querySelector('span');

      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveClass('bg-background');
      expect(thumb).toHaveClass('pointer-events-none');
      expect(thumb).toHaveClass('block');
      expect(thumb).toHaveClass('size-5');
      expect(thumb).toHaveClass('rounded-full');
      expect(thumb).toHaveClass('shadow-lg');
      expect(thumb).toHaveClass('ring-0');
      expect(thumb).toHaveClass('transition-transform');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('role', 'switch');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
      expect(switchButton).toHaveAttribute('data-state', 'checked');
    });

    it('has accessible label', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
    });

    it('can be toggled with keyboard', async () => {
      const checked = signal(true);
      await render(ZardSwitchComponent, {
        bindings: [inputBinding('zChecked', checked)],
      });

      const switchButton = screen.getByRole('switch');
      switchButton.focus();
      expect(switchButton).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      expect(switchButton).toHaveAttribute('aria-checked', 'false');

      await userEvent.keyboard(' ');
      expect(switchButton).toHaveAttribute('aria-checked', 'true');
    });
  });
});
