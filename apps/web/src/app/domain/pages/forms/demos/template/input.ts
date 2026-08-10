import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

@Component({
  selector: 'z-forms-template-input',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Profile Settings</z-card-title>
        <z-card-description>Update your profile information below.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-input" #profileForm="ngForm" (ngSubmit)="onSubmit(profileForm)">
          <div z-field-group>
            @let usernameInvalid = username.invalid && username.touched;
            <div z-field [attr.data-invalid]="usernameInvalid || null">
              <label z-field-label for="forms-template-input-username">Username</label>
              <input
                z-input
                required
                minlength="3"
                maxlength="10"
                pattern="[a-zA-Z0-9_]+"
                name="username"
                #username="ngModel"
                id="forms-template-input-username"
                autocomplete="username"
                placeholder="shadcn"
                [(ngModel)]="model.username"
                [attr.aria-invalid]="usernameInvalid || null"
              />
              <p z-field-description>
                This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
                numbers, and underscores.
              </p>
              @if (usernameInvalid) {
                <z-field-error>
                  @if (username.hasError('required') || username.hasError('minlength')) {
                    Username must be at least 3 characters.
                  } @else if (username.hasError('maxlength')) {
                    Username must be at most 10 characters.
                  } @else if (username.hasError('pattern')) {
                    Username can only contain letters, numbers, and underscores.
                  }
                </z-field-error>
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset(profileForm)">Reset</button>
          <button z-button type="submit" form="forms-template-input">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateInputComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model = { username: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ username: '' });
  }
}
