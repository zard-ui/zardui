import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

const SLOT_CLASSES =
  '[&_[data-slot=input-otp-slot]>input]:h-12 [&_[data-slot=input-otp-slot]>input]:w-11 [&_[data-slot=input-otp-slot]>input]:text-xl';

@Component({
  selector: 'z-demo-input-otp-form',
  imports: [ZardInputOtpImports, ZardFieldImports, ZardCardImports, ZardButtonComponent, ReactiveFormsModule, NgIcon],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <z-card class="mx-auto max-w-md">
        <div z-card-header>
          <z-card-title zTitle="Verify your login" />
          <z-card-description [zDescription]="description" />
          <ng-template #description>
            Enter the verification code we sent to your email address:
            <span class="font-medium">m&#64;example.com</span>
          </ng-template>
        </div>

        <div z-card-content>
          <div z-field>
            <div class="flex items-center justify-between">
              <label z-field-label for="otp-verification">Verification code</label>
              <button z-button type="button" zType="outline" zSize="xs">
                <ng-icon name="lucideRefreshCw" />
                Resend Code
              </button>
            </div>
            <z-input-otp id="otp-verification" [zMaxLength]="6" formControlName="code">
              <z-input-otp-group [class]="slotClasses">
                <z-input-otp-slot [zIndex]="0" />
                <z-input-otp-slot [zIndex]="1" />
                <z-input-otp-slot [zIndex]="2" />
              </z-input-otp-group>
              <z-input-otp-separator class="mx-2" />
              <z-input-otp-group [class]="slotClasses">
                <z-input-otp-slot [zIndex]="3" />
                <z-input-otp-slot [zIndex]="4" />
                <z-input-otp-slot [zIndex]="5" />
              </z-input-otp-group>
            </z-input-otp>
            <p z-field-description>
              <a href="#">I no longer have access to this email address.</a>
            </p>
          </div>
        </div>

        <div z-card-footer>
          <div z-field>
            <button z-button type="submit" class="w-full" [disabled]="form.invalid">Verify</button>
            <div class="text-muted-foreground text-sm">
              Having trouble signing in?
              <a href="#" class="hover:text-primary underline underline-offset-4 transition-colors">Contact support</a>
            </div>
          </div>
        </div>
      </z-card>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRefreshCw })],
})
export class ZardDemoInputOtpFormComponent {
  readonly slotClasses = SLOT_CLASSES;

  readonly form = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Verification code:', this.form.value.code);
    }
  }
}
