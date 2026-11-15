import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardNativeSelectDirective } from './native-select.directive';

@Component({
  imports: [ZardNativeSelectDirective, ReactiveFormsModule],
  template: `
    <select z-native-select [formControl]="control" data-testid="reactive">
      <option value="todo">Todo</option>
      <option value="in-progress">In progress</option>
      <option value="done">Done</option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ReactiveHostComponent {
  readonly control = new FormControl('todo');
}

@Component({
  imports: [ZardNativeSelectDirective, FormsModule],
  template: `
    <select z-native-select [(ngModel)]="status" data-testid="model">
      <option value="todo">Todo</option>
      <option value="in-progress">In progress</option>
      <option value="done">Done</option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NgModelHostComponent {
  readonly status = signal('in-progress');
}

describe('ZardNativeSelectDirective', () => {
  describe('basic rendering', () => {
    it('keeps the native select with its options and groups', async () => {
      await render(
        `
          <select z-native-select aria-label="Department">
            <optgroup label="Engineering">
              <option value="fe">Frontend</option>
              <option value="be">Backend</option>
            </optgroup>
            <optgroup label="Sales">
              <option value="ae">Account executive</option>
            </optgroup>
          </select>
        `,
        { imports: [ZardNativeSelectDirective] },
      );

      const select = screen.getByRole('combobox', { name: 'Department' });
      expect(select.tagName).toBe('SELECT');
      expect(screen.getAllByRole('option')).toHaveLength(3);
      expect(screen.getAllByRole('group')).toHaveLength(2);
      expect(screen.getByRole('group', { name: 'Engineering' })).toBeInTheDocument();
    });

    it('sets the data-slot and exposes the directive through exportAs', async () => {
      await render('<select z-native-select #ns="zNativeSelect" data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      expect(screen.getByTestId('s')).toHaveAttribute('data-slot', 'native-select');
    });

    it('applies the base styles and removes the native appearance', async () => {
      await render('<select z-native-select data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveClass('appearance-none', 'w-full', 'border-input', 'rounded-lg', 'h-8');
    });

    it('merges the custom class last', async () => {
      await render('<select z-native-select class="w-64 h-12" data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveClass('w-64', 'h-12');
      expect(select).not.toHaveClass('w-full', 'h-8');
    });

    it('draws the chevron as a background image that mirrors in RTL', async () => {
      await render('<select z-native-select data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const { className } = screen.getByTestId('s');
      expect(className).toContain('bg-[url(data:image/svg+xml');
      expect(className).toContain('dark:bg-[url(data:image/svg+xml');
      expect(className).toContain('bg-position-[right_0.625rem_center]');
      expect(className).toContain('rtl:bg-position-[left_0.625rem_center]');
      expect(className).toContain('pe-8');
    });

    it('styles the option list from the root for dark mode', async () => {
      await render('<select z-native-select data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveClass('dark:scheme-dark', '[&_option]:bg-[Canvas]', '[&_option]:text-[CanvasText]');
    });
  });

  describe('size variants', () => {
    it('uses the default size', async () => {
      await render('<select z-native-select data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveAttribute('data-size', 'default');
      expect(select).toHaveClass('h-8');
    });

    it('applies the sm size', async () => {
      await render('<select z-native-select zSize="sm" data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveAttribute('data-size', 'sm');
      expect(select).toHaveClass('h-7');
      expect(select).not.toHaveClass('h-8');
    });

    it('applies the lg size', async () => {
      await render('<select z-native-select zSize="lg" data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveAttribute('data-size', 'lg');
      expect(select).toHaveClass('h-10');
      expect(select).not.toHaveClass('h-8');
    });

    it('reacts to size changes', async () => {
      const { rerender } = await render(
        '<select z-native-select [zSize]="size" data-testid="s"><option>A</option></select>',
        { imports: [ZardNativeSelectDirective], componentProperties: { size: 'sm' } },
      );

      expect(screen.getByTestId('s')).toHaveClass('h-7');
      await rerender({ componentProperties: { size: 'lg' } });
      expect(screen.getByTestId('s')).toHaveClass('h-10');
    });
  });

  describe('native attributes', () => {
    it('passes disabled through', async () => {
      await render('<select z-native-select disabled data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toBeDisabled();
      expect(select).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('passes required, name and id through', async () => {
      await render('<select z-native-select required name="status" id="status"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
      expect(select).toHaveAttribute('name', 'status');
      expect(select).toHaveAttribute('id', 'status');
    });

    it('supports multiple', async () => {
      await render(
        '<select z-native-select multiple aria-label="Tags"><option value="a">A</option><option value="b">B</option></select>',
        { imports: [ZardNativeSelectDirective] },
      );

      const select = screen.getByRole('listbox', { name: 'Tags' });
      expect(select).toHaveAttribute('multiple');
      expect(select).toHaveClass('[&[multiple]]:h-auto', '[&[multiple]]:bg-none');
    });

    it('keeps aria-invalid as set by the consumer and styles it', async () => {
      await render('<select z-native-select aria-invalid="true" data-testid="s"><option>A</option></select>', {
        imports: [ZardNativeSelectDirective],
      });

      const select = screen.getByTestId('s');
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(select).toHaveClass('aria-invalid:border-destructive', 'aria-invalid:ring-destructive/20');
    });

    it('toggles aria-invalid from a binding', async () => {
      const { rerender } = await render(
        '<select z-native-select [attr.aria-invalid]="invalid || null" data-testid="s"><option>A</option></select>',
        { imports: [ZardNativeSelectDirective], componentProperties: { invalid: true } },
      );

      expect(screen.getByTestId('s')).toHaveAttribute('aria-invalid', 'true');
      await rerender({ componentProperties: { invalid: false } });
      expect(screen.getByTestId('s')).not.toHaveAttribute('aria-invalid');
    });

    it('is labelled by a native label', async () => {
      await render(
        '<label for="dept">Department</label><select z-native-select id="dept"><option>A</option></select>',
        { imports: [ZardNativeSelectDirective] },
      );

      expect(screen.getByLabelText('Department').tagName).toBe('SELECT');
    });
  });

  describe('Reactive Forms', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;
    let control: FormControl<string | null>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ReactiveHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(ReactiveHostComponent);
      ({ control } = fixture.componentInstance);
      fixture.detectChanges();
    });

    it('reflects the initial control value', () => {
      expect(screen.getByTestId('reactive')).toHaveValue('todo');
    });

    it('syncs control to element', () => {
      control.setValue('done');
      fixture.detectChanges();

      expect(screen.getByTestId('reactive')).toHaveValue('done');
    });

    it('syncs element to control when the user picks an option', async () => {
      const user = userEvent.setup();

      await user.selectOptions(screen.getByTestId('reactive'), 'in-progress');

      expect(control.value).toBe('in-progress');
    });

    it('marks the control as touched on blur', async () => {
      const user = userEvent.setup();

      expect(control.touched).toBe(false);
      await user.click(screen.getByTestId('reactive'));
      await user.tab();

      expect(control.touched).toBe(true);
    });

    it('reflects the disabled state of the control', () => {
      control.disable();
      fixture.detectChanges();
      expect(screen.getByTestId('reactive')).toBeDisabled();

      control.enable();
      fixture.detectChanges();
      expect(screen.getByTestId('reactive')).not.toBeDisabled();
    });
  });

  describe('ngModel', () => {
    let fixture: ComponentFixture<NgModelHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [NgModelHostComponent] }).compileComponents();
      fixture = TestBed.createComponent(NgModelHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('reflects the initial model value', () => {
      expect(screen.getByTestId('model')).toHaveValue('in-progress');
    });

    it('syncs the model to the element', async () => {
      fixture.componentInstance.status.set('done');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(screen.getByTestId('model')).toHaveValue('done');
    });

    it('syncs the element to the model', async () => {
      const user = userEvent.setup();

      await user.selectOptions(screen.getByTestId('model'), 'todo');

      expect(fixture.componentInstance.status()).toBe('todo');
    });
  });
});
