import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { form, FormField, min } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { fireEvent, screen } from '@testing-library/angular';
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

@Component({
  imports: [ZardInputDirective, ReactiveFormsModule],
  template: `
    <input z-input type="number" [formControl]="control" data-testid="number-form-input" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestNumberFormHostComponent {
  control = new FormControl<number | null>(null);
}

@Component({
  imports: [ZardInputDirective, ReactiveFormsModule],
  template: `
    <input z-input type="range" [formControl]="control" data-testid="range-form-input" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRangeFormHostComponent {
  control = new FormControl<number | null>(null);
}

@Component({
  imports: [ZardInputDirective, FormField],
  template: `
    <input z-input type="number" [formField]="profileForm.age" data-testid="signal-number-input" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestSignalNumberFormHostComponent {
  readonly profileModel = signal({ age: 1 });
  readonly profileForm = form(this.profileModel, profile => {
    min(profile.age, 0);
  });
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

describe('ZardInputDirective with number forms', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('syncs number input changes as numbers with reactive forms', async () => {
    await TestBed.configureTestingModule({
      imports: [TestNumberFormHostComponent, ReactiveFormsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestNumberFormHostComponent);
    const { control } = fixture.componentInstance;
    fixture.detectChanges();

    const input = screen.getByTestId('number-form-input');

    control.setValue(7);
    fixture.detectChanges();
    expect(input).toHaveValue(7);

    await user.clear(input);
    expect(control.value).toBeNull();

    await user.type(input, '42');
    expect(control.value).toBe(42);
  });

  it('normalizes NaN numeric input values to null', async () => {
    await TestBed.configureTestingModule({
      imports: [TestNumberFormHostComponent, ReactiveFormsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestNumberFormHostComponent);
    const { control } = fixture.componentInstance;
    fixture.detectChanges();

    const input = screen.getByTestId('number-form-input') as HTMLInputElement;
    control.setValue(7);
    fixture.detectChanges();
    Object.defineProperty(input, 'valueAsNumber', { configurable: true, value: Number.NaN });

    input.value = '42';
    fireEvent.input(input);

    expect(control.value).toBeNull();
  });

  it('syncs range input changes as numbers with reactive forms', async () => {
    await TestBed.configureTestingModule({
      imports: [TestRangeFormHostComponent, ReactiveFormsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestRangeFormHostComponent);
    const { control } = fixture.componentInstance;
    fixture.detectChanges();

    const input = screen.getByTestId('range-form-input');

    control.setValue(7);
    fixture.detectChanges();
    expect((input as HTMLInputElement).valueAsNumber).toBe(7);

    (input as HTMLInputElement).value = '42';
    fireEvent.input(input);

    expect(control.value).toBe(42);
  });

  it('binds number fields with signal forms validation', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSignalNumberFormHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSignalNumberFormHostComponent);
    fixture.detectChanges();

    const input = screen.getByTestId('signal-number-input');

    expect(input).toHaveValue(1);
    expect(fixture.componentInstance.profileForm.age().valid()).toBe(true);

    await user.clear(input);
    await user.type(input, '24');

    expect(fixture.componentInstance.profileModel().age).toBe(24);
    expect(fixture.componentInstance.profileForm.age().valid()).toBe(true);
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

    it('handles nullish and empty string values in writeValue', () => {
      const input = screen.getByTestId('form-input');
      const directive = fixture.debugElement.query(By.directive(ZardInputDirective))?.injector.get(ZardInputDirective);

      directive?.writeValue(undefined);
      fixture.detectChanges();
      expect(input).toHaveValue('');

      directive?.writeValue(null);
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
