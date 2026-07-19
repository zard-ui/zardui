import { Component, inputBinding, outputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardToggleComponent } from './toggle.component';
import { toggleVariants } from './toggle.variants';

@Component({
  imports: [ZardToggleComponent, ReactiveFormsModule],
  template: `
    <z-toggle zAriaLabel="Bold" [formControl]="control">Bold</z-toggle>
  `,
})
class ToggleFormHostComponent {
  control = new FormControl(false);
}

describe('ZardToggleComponent', () => {
  describe('Basic Rendering', () => {
    it('renders toggle with correct attributes in off state', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('data-state', 'off');
      expect(button).toHaveAttribute('aria-label', 'Bold');
    });

    it('renders toggle in on state when zValue is true', async () => {
      const zValue = signal(true);
      await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('data-state', 'on');
    });
  });

  describe('State Management', () => {
    it('toggles from off to on when clicked', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(button).toHaveAttribute('data-state', 'on');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('toggles from on to off when clicked', async () => {
      const zValue = signal(true);
      await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(button).toHaveAttribute('data-state', 'off');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Type Variants', () => {
    it('applies default type variant classes', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zType', signal('default')),
        ],
      });

      const button = screen.getByRole('button');
      const expectedClasses = toggleVariants({ zType: 'default', zSize: 'default' }).split(' ');
      expectedClasses.forEach(cls => {
        expect(button).toHaveClass(cls);
      });
    });

    it('applies outline type variant classes', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zType', signal('outline')),
        ],
      });

      const button = screen.getByRole('button');
      const expectedClasses = toggleVariants({ zType: 'outline', zSize: 'default' }).split(' ');
      expectedClasses.forEach(cls => {
        expect(button).toHaveClass(cls);
      });
    });
  });

  describe('Size Variants', () => {
    it('applies default size classes', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zSize', signal('default')),
        ],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
    });

    it('applies small size classes', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zSize', signal('sm')),
        ],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-7');
    });

    it('applies large size classes', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zSize', signal('lg')),
        ],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');
    });
  });

  describe('Disabled State', () => {
    it('disables the button when zDisabled is true', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zDisabled', signal(true)),
        ],
      });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('prevents toggle when disabled', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('zDisabled', signal(true)),
        ],
      });

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(button).toHaveAttribute('data-state', 'off');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('applies disabled state via setDisabledState', async () => {
      const zValue = signal(false);
      const r = await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const component = r.fixture.componentInstance;
      component.setDisabledState(true);
      r.fixture.detectChanges();

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('prevents toggle when disabled via setDisabledState', async () => {
      const zValue = signal(true);
      const r = await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const component = r.fixture.componentInstance;
      component.setDisabledState(true);
      r.fixture.detectChanges();

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('data-state', 'on');
    });
  });

  describe('ControlValueAccessor', () => {
    it('implements writeValue to update value state', async () => {
      const zValue = signal(false);
      const r = await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const component = r.fixture.componentInstance;
      component.writeValue(true);
      r.fixture.detectChanges();

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('data-state', 'on');
    });

    it('emits zValueChange when toggle is clicked', async () => {
      const zValue = signal(false);
      const onChangeMock = jest.fn();
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          outputBinding('zValueChange', onChangeMock),
        ],
      });

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(onChangeMock).toHaveBeenCalledWith(true);
    });

    it('marks form control as touched when toggle is clicked', async () => {
      await TestBed.configureTestingModule({
        imports: [ToggleFormHostComponent, ReactiveFormsModule],
      }).compileComponents();

      const fixture = TestBed.createComponent(ToggleFormHostComponent);
      fixture.detectChanges();

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(fixture.componentInstance.control.touched).toBe(true);
    });
  });

  describe('Custom Classes', () => {
    it('applies custom classes via class input', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [
          inputBinding('zValue', zValue),
          inputBinding('zAriaLabel', signal('Bold')),
          inputBinding('class', signal('custom-class another-class')),
        ],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('another-class');
    });
  });

  describe('Accessibility', () => {
    it('has aria-label from zAriaLabel input', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold text'))],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Bold text');
    });

    it('updates aria-pressed attribute when toggled', async () => {
      const zValue = signal(false);
      await render(ZardToggleComponent, {
        bindings: [inputBinding('zValue', zValue), inputBinding('zAriaLabel', signal('Bold'))],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
