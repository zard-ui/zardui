import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-forms-template-switch',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Security Settings</z-card-title>
        <z-card-description>Manage your account security preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-switch" #securityForm="ngForm" (ngSubmit)="onSubmit(securityForm)">
          <div z-field-group>
            @let twoFactorInvalid = mustBeEnabled;
            <div z-field zOrientation="horizontal" [attr.data-invalid]="twoFactorInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-template-switch-two-factor">Multi-factor authentication</label>
                <p z-field-description>Enable multi-factor authentication to secure your account.</p>
                @if (twoFactorInvalid) {
                  <z-field-error>It is highly recommended to enable two-factor authentication.</z-field-error>
                }
              </div>
              <z-switch
                name="twoFactor"
                zId="forms-template-switch-two-factor"
                [(ngModel)]="model.twoFactor"
                [zInvalid]="twoFactorInvalid"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset(securityForm)">Reset</button>
          <button z-button type="submit" form="forms-template-switch">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateSwitchComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model = { twoFactor: false };
  protected submitted = false;

  /**
   * `required` on a boolean control only rejects `null`/`undefined`, never `false` —
   * there is no `requiredTrue` attribute in template-driven forms, so the rule lives here.
   */
  protected get mustBeEnabled(): boolean {
    return this.submitted && !this.model.twoFactor;
  }

  protected onSubmit(form: NgForm): void {
    this.submitted = true;

    if (form.invalid || this.mustBeEnabled) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    this.submitted = false;
    form.resetForm({ twoFactor: false });
  }
}
