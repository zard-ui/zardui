import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ZardInputOtpGroupComponent } from './input-otp-group.component';
import { ZardInputOtpSeparatorComponent } from './input-otp-separator.component';
import { ZardInputOtpSlotComponent } from './input-otp-slot.component';
import { ZardInputOtpComponent } from './input-otp.component';

@Component({
  selector: 'test-host',
  imports: [
    ZardInputOtpComponent,
    ZardInputOtpSlotComponent,
    ZardInputOtpGroupComponent,
    ZardInputOtpSeparatorComponent,
    ReactiveFormsModule,
  ],
  template: `
    <z-input-otp [formControl]="control" [zMaxLength]="6" (zComplete)="onComplete($event)">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  control = new FormControl('');
  completedValue = '';
  onComplete(value: string) {
    this.completedValue = value;
  }
}

describe('ZardInputOtpComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const slotInputs = (): HTMLInputElement[] =>
    fixture.debugElement.queryAll(By.css('[data-slot] input')).map(d => d.nativeElement);

  const typeInto = (input: HTMLInputElement, value: string, inputType = 'insertText') => {
    input.value = value;
    input.dispatchEvent(new InputEvent('input', { data: value, inputType }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render six slots', () => {
    expect(slotInputs().length).toBe(6);
  });

  it('should propagate writeValue to slot inputs', () => {
    component.control.setValue('123456');
    fixture.detectChanges();

    const values = slotInputs().map(i => i.value);
    expect(values.join('')).toBe('123456');
  });

  it('should clear slot inputs when control resets', () => {
    component.control.setValue('123456');
    fixture.detectChanges();
    component.control.setValue('');
    fixture.detectChanges();

    const values = slotInputs().map(i => i.value);
    expect(values.every(v => v === '')).toBe(true);
  });

  it('should update FormControl when typing into a slot', () => {
    const inputs = slotInputs();
    typeInto(inputs[0], '1');
    typeInto(inputs[1], '2');
    typeInto(inputs[2], '3');

    expect(component.control.value).toBe('123');
  });

  it('should not exceed effectiveMaxLength when pasting longer values', () => {
    const inputs = slotInputs();
    inputs[0].focus();

    const event = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    event.clipboardData?.setData('text/plain', '1234567890');
    inputs[0].dispatchEvent(event);
    fixture.detectChanges();

    expect(component.control.value?.length ?? 0).toBeLessThanOrEqual(6);
    expect(component.control.value).toBe('123456');
  });

  it('should filter pasted characters by zPattern', () => {
    const inputs = slotInputs();
    inputs[0].focus();

    const event = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
    event.clipboardData?.setData('text/plain', '1a2b3c');
    inputs[0].dispatchEvent(event);
    fixture.detectChanges();

    expect(component.control.value).toBe('123');
  });

  it('should emit zComplete when value reaches effectiveMaxLength', () => {
    const inputs = slotInputs();
    for (let i = 0; i < 6; i++) {
      typeInto(inputs[i], String(i + 1));
    }
    expect(component.completedValue).toBe('123456');
  });

  it('should reflect disabled state on the host', () => {
    component.control.disable();
    fixture.detectChanges();
    const host = fixture.debugElement.query(By.directive(ZardInputOtpComponent));
    expect(host.nativeElement.getAttribute('data-disabled')).toBe('');
  });

  it('should render the separator with aria-hidden', () => {
    const separator = fixture.nativeElement.querySelector('[data-input-otp-separator]');
    expect(separator).toBeTruthy();
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });

  it('should expose a positional aria-label on every slot input', () => {
    const labels = slotInputs().map(i => i.getAttribute('aria-label'));
    expect(labels).toEqual([
      'One-time password digit 1 of 6',
      'One-time password digit 2 of 6',
      'One-time password digit 3 of 6',
      'One-time password digit 4 of 6',
      'One-time password digit 5 of 6',
      'One-time password digit 6 of 6',
    ]);
  });

  it('should expose autocomplete="one-time-code" and inputmode on slot inputs', () => {
    const inputs = slotInputs();
    inputs.forEach(input => {
      expect(input.getAttribute('autocomplete')).toBe('one-time-code');
      expect(input.getAttribute('inputmode')).toBe('numeric');
    });
  });

  it('should not preventDefault on Tab key (no keyboard trap)', () => {
    const inputs = slotInputs();
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    inputs[0].dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('should not preventDefault on Enter key', () => {
    const inputs = slotInputs();
    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    inputs[0].dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('should preventDefault on disallowed character', () => {
    const inputs = slotInputs();
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    inputs[0].dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('should advance focus on ArrowRight and retreat on ArrowLeft', () => {
    const inputs = slotInputs();
    inputs[0].focus();

    inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    expect(document.activeElement).toBe(inputs[1]);

    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
    expect(document.activeElement).toBe(inputs[0]);
  });

  it('should not jump out of the OTP container on ArrowRight from last slot', () => {
    const inputs = slotInputs();
    inputs[5].focus();

    inputs[5].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    expect(document.activeElement).toBe(inputs[5]);
  });

  it('should auto-detect effectiveMaxLength from slot count when zMaxLength is undefined', async () => {
    @Component({
      imports: [ZardInputOtpComponent, ZardInputOtpSlotComponent, ZardInputOtpGroupComponent],
      template: `
        <z-input-otp>
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
          </z-input-otp-group>
        </z-input-otp>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class AutoLengthHost {}

    const auto = TestBed.createComponent(AutoLengthHost);
    auto.detectChanges();

    const otp = auto.debugElement.query(By.directive(ZardInputOtpComponent)).componentInstance as ZardInputOtpComponent;
    expect(otp.effectiveMaxLength()).toBe(4);
  });
});
