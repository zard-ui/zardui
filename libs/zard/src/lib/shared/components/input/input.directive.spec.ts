import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardInputDirective } from './input.directive';

@Component({
  imports: [ZardInputDirective],
  template: `
    <input z-input data-testid="test-input" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {}

@Component({
  imports: [ZardInputDirective, ReactiveFormsModule],
  template: `
    <input z-input [formControl]="control" data-testid="form-input" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestFormHostComponent {
  control = new FormControl('');
}

describe('ZardInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('creates directive instance', () => {
    const input = screen.getByTestId('test-input');

    expect(input).toBeInTheDocument();
  });

  it('disables input when disable method is called', async () => {
    const input = screen.getByTestId('test-input');
    const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);

    if (directive) {
      directive.disable(true);
      fixture.detectChanges();
      expect(input).toBeDisabled();
    } else {
      fail('Directive not found');
    }
  });
});

describe('ZardInputDirective with Forms', () => {
  let fixture: ComponentFixture<TestFormHostComponent>;
  let user: ReturnType<typeof userEvent.setup>;
  let control: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormHostComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestFormHostComponent);
    ({ control } = fixture.componentInstance);
    user = userEvent.setup();
    fixture.detectChanges();
  });

  describe('ControlValueAccessor implementation', () => {
    it('implements ControlValueAccessor interface methods', () => {
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);

      expect(directive?.writeValue).toBeDefined();
      expect(directive?.registerOnChange).toBeDefined();
      expect(directive?.registerOnTouched).toBeDefined();
    });

    it('writes value to native element when writeValue is called', () => {
      const input = screen.getByTestId('form-input');
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);

      directive?.writeValue('test value');
      fixture.detectChanges();

      expect(input).toHaveValue('test value');
    });

    it('handles undefined and empty string values in writeValue', () => {
      const input = screen.getByTestId('form-input');
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);

      directive?.writeValue(undefined);
      fixture.detectChanges();
      expect(input).toHaveValue('');

      directive?.writeValue('');
      fixture.detectChanges();
      expect(input).toHaveValue('');
    });

    it('calls registerOnChange callback when input value changes', async () => {
      const input = screen.getByTestId('form-input');
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);
      const onChangeSpy = jest.fn();

      directive?.registerOnChange(onChangeSpy);

      await user.clear(input);
      await user.type(input, 'new value');

      expect(onChangeSpy).toHaveBeenCalledWith('new value');
    });

    it('calls registerOnTouched callback when input loses focus', async () => {
      const input = screen.getByTestId('form-input');
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);
      const onTouchedSpy = jest.fn();

      directive?.registerOnTouched(onTouchedSpy);

      await user.click(input);
      await user.tab();

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('FormControl integration', () => {
    it('syncs form control value to native element', () => {
      const input = screen.getByTestId('form-input');

      control.setValue('form value');
      fixture.detectChanges();

      expect(input).toHaveValue('form value');
    });

    it('syncs native element value to form control', async () => {
      const input = screen.getByTestId('form-input');

      await user.clear(input);
      await user.type(input, 'native value');

      expect(control.value).toBe('native value');
    });

    it('updates form control touched state on blur', async () => {
      const input = screen.getByTestId('form-input');

      expect(control.touched).toBe(false);

      await user.click(input);
      await user.tab();

      expect(control.touched).toBe(true);
    });

    it('handles form control disabled state', () => {
      const input = screen.getByTestId('form-input');

      control.disable();
      fixture.detectChanges();

      expect(input).toBeDisabled();

      control.enable();
      fixture.detectChanges();

      expect(input).not.toBeDisabled();
    });
  });

  describe('Edge cases', () => {
    it('handles rapid value changes', () => {
      const input = screen.getByTestId('form-input');
      const values = ['a', 'b', 'c', 'd', 'e'];

      values.forEach(value => {
        control.setValue(value);
        fixture.detectChanges();
        expect(input).toHaveValue(value);
      });
    });

    it('maintains sync after multiple blur events', async () => {
      const input = screen.getByTestId('form-input');
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);
      const onTouchedSpy = jest.fn();

      directive?.registerOnTouched(onTouchedSpy);

      for (let i = 0; i < 3; i++) {
        await user.click(input);
        await user.tab();
      }

      expect(onTouchedSpy).toHaveBeenCalledTimes(3);
    });
  });
});
