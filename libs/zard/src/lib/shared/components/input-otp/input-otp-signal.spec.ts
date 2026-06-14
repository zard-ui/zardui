import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { ZardInputOtpGroupComponent } from './input-otp-group.component';
import { ZardInputOtpSignalComponent } from './input-otp-signal.component';
import { ZardInputOtpSlotComponent } from './input-otp-slot.component';

@Component({
  selector: 'test-host',
  imports: [ZardInputOtpSignalComponent, ZardInputOtpSlotComponent, ZardInputOtpGroupComponent, FormField],
  template: `
    <z-input-otp-signal [formField]="otpForm.pin" (zComplete)="onComplete($event)">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp-signal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  readonly model = signal({ pin: '' });
  readonly otpForm = form(this.model);
  completedValue = '';
  onComplete(value: string) {
    this.completedValue = value;
  }
}

describe('ZardInputOtpSignalComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const slotInputs = (): HTMLInputElement[] =>
    fixture.debugElement.queryAll(By.css('[data-slot] input')).map(d => d.nativeElement);

  const typeInto = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new InputEvent('input', { data: value, inputType: 'insertText' }));
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

  it('should reflect initial field value into slot inputs', () => {
    component.model.set({ pin: '987654' });
    fixture.detectChanges();

    const values = slotInputs().map(i => i.value);
    expect(values.join('')).toBe('987654');
  });

  it('should push typed user input back to the bound field', () => {
    const inputs = slotInputs();
    typeInto(inputs[0], '1');
    typeInto(inputs[1], '2');
    typeInto(inputs[2], '3');

    expect(component.otpForm().value().pin).toBe('123');
  });

  it('should sync programmatic field updates to slot inputs', () => {
    const inputs = slotInputs();
    typeInto(inputs[0], '1');
    typeInto(inputs[1], '2');
    expect(component.otpForm().value().pin).toBe('12');

    component.model.set({ pin: 'ABCDEF' });
    fixture.detectChanges();
    expect(
      slotInputs()
        .map(i => i.value)
        .join(''),
    ).toBe('ABCDEF');
  });

  it('should fill slots from a pasted value filtered by zPattern', () => {
    const inputs = slotInputs();
    inputs[0].focus();

    const event = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
    event.clipboardData?.setData('text/plain', '1a2b3c');
    inputs[0].dispatchEvent(event);
    fixture.detectChanges();

    expect(component.otpForm().value().pin).toBe('123');
  });

  it('should not exceed effectiveMaxLength when pasting longer values', () => {
    const inputs = slotInputs();
    inputs[0].focus();

    const event = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
    event.clipboardData?.setData('text/plain', '1234567890');
    inputs[0].dispatchEvent(event);
    fixture.detectChanges();

    expect(component.otpForm().value().pin).toBe('123456');
  });

  it('should advance focus on ArrowRight and retreat on ArrowLeft', () => {
    const inputs = slotInputs();
    inputs[0].focus();

    inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
    expect(document.activeElement).toBe(inputs[1]);

    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
    expect(document.activeElement).toBe(inputs[0]);
  });

  it('should move focus to the previous slot on Backspace when the slot is empty', () => {
    const inputs = slotInputs();
    inputs[1].focus();

    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true }));
    expect(document.activeElement).toBe(inputs[0]);
  });

  it('should emit zComplete when all slots are filled', () => {
    const inputs = slotInputs();
    for (let i = 0; i < 6; i++) {
      typeInto(inputs[i], String(i + 1));
    }
    expect(component.completedValue).toBe('123456');
  });

  it('should reflect disabled state on the host', () => {
    const otp = fixture.debugElement.query(By.directive(ZardInputOtpSignalComponent))
      .componentInstance as ZardInputOtpSignalComponent;
    otp.disabled.set(true);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.directive(ZardInputOtpSignalComponent));
    expect(host.nativeElement.getAttribute('data-disabled')).toBe('');
    slotInputs().forEach(input => expect(input.disabled).toBe(true));
  });

  it('should expose readonly inputs when zReadonly is true', async () => {
    @Component({
      imports: [ZardInputOtpSignalComponent, ZardInputOtpSlotComponent, ZardInputOtpGroupComponent, FormField],
      template: `
        <z-input-otp-signal [formField]="otpForm.pin" [zReadonly]="true">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
          </z-input-otp-group>
        </z-input-otp-signal>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class ReadonlyHost {
      readonly model = signal({ pin: '' });
      readonly otpForm = form(this.model);
    }

    const ro = TestBed.createComponent(ReadonlyHost);
    ro.detectChanges();

    const inputs = ro.debugElement.queryAll(By.css('[data-slot] input')).map(d => d.nativeElement as HTMLInputElement);
    inputs.forEach(input => expect(input.readOnly).toBe(true));

    const otp = ro.debugElement.query(By.directive(ZardInputOtpSignalComponent))
      .componentInstance as ZardInputOtpSignalComponent;
    inputs[0].focus();
    const event = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
    event.clipboardData?.setData('text/plain', '123');
    inputs[0].dispatchEvent(event);
    ro.detectChanges();

    expect(otp.tokens().join('')).toBe('');
  });
});
