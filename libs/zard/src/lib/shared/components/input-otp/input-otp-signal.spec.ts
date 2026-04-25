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
    <z-input-otp-signal [formField]="otpForm.pin">
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
});
