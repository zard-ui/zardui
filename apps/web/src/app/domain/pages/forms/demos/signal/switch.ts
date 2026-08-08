import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, submit, validate } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-forms-signal-switch',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Security Settings</z-card-title>
        <z-card-description>Manage your account security preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-switch" (submit)="onSubmit($event)">
          <div z-field-group>
            @let twoFactor = securityForm.twoFactor();
            @let twoFactorInvalid = twoFactor.invalid() && twoFactor.touched();
            <div z-field zOrientation="horizontal" [attr.data-invalid]="twoFactorInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-signal-switch-two-factor">Multi-factor authentication</label>
                <p z-field-description>Enable multi-factor authentication to secure your account.</p>
                @if (twoFactorInvalid) {
                  <z-field-error [zErrors]="twoFactor.errors()" />
                }
              </div>
              <z-switch
                zId="forms-signal-switch-two-factor"
                [formField]="securityForm.twoFactor"
                [zInvalid]="twoFactorInvalid"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-switch">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalSwitchComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ twoFactor: false });

  protected readonly securityForm = form(this.model, schemaPath => {
    validate(schemaPath.twoFactor, ({ value }) =>
      value()
        ? undefined
        : { kind: 'twoFactorRequired', message: 'It is highly recommended to enable two-factor authentication.' },
    );
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.securityForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.securityForm().reset({ twoFactor: false });
  }
}
