import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
  standalone: true,
  template: `
    <z-input-otp [formControl]="control" [zMaxLength]="6">
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
}

describe('ZardInputOtpComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

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

  it('should render all slots', () => {
    const slots = fixture.nativeElement.querySelectorAll('[data-slot]');
    expect(slots.length).toBe(6);
  });

  it('should update value when input changes', () => {
    component.control.setValue('123456');
    fixture.detectChanges();
    expect(component.control.value).toBe('123456');
  });

  it('should limit input to max length', () => {
    component.control.setValue('1234567890');
    fixture.detectChanges();
    expect(component.control.value?.length).toBeLessThanOrEqual(6);
  });

  it('should be disabled when control is disabled', () => {
    component.control.disable();
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-input-otp-container]');
    expect(container.closest('[data-disabled]')).toBeTruthy();
  });

  it('should render separator', () => {
    const separator = fixture.nativeElement.querySelector('[data-input-otp-separator]');
    expect(separator).toBeTruthy();
  });
});
