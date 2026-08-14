import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-forms-reactive-switch',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Security Settings</z-card-title>
        <z-card-description>Manage your account security preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-switch" [formGroup]="securityForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let twoFactor = securityForm.controls.twoFactor;
            @let twoFactorInvalid = twoFactor.invalid && twoFactor.touched;
            <div z-field zOrientation="horizontal" [attr.data-invalid]="twoFactorInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-reactive-switch-two-factor">Multi-factor authentication</label>
                <p z-field-description>Enable multi-factor authentication to secure your account.</p>
                @if (twoFactorInvalid) {
                  <z-field-error>It is highly recommended to enable two-factor authentication.</z-field-error>
                }
              </div>
              <z-switch
                formControlName="twoFactor"
                zId="forms-reactive-switch-two-factor"
                [zInvalid]="twoFactorInvalid"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="securityForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-switch">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveSwitchComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly securityForm = new FormGroup({
    twoFactor: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  protected onSubmit(): void {
    if (this.securityForm.invalid) {
      this.securityForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.securityForm.getRawValue(), null, 2),
    });
  }
}
