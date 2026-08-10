import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, pattern, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

@Component({
  selector: 'z-forms-signal-input',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Profile Settings</z-card-title>
        <z-card-description>Update your profile information below.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-input" (submit)="onSubmit($event)">
          <div z-field-group>
            @let username = profileForm.username();
            @let usernameInvalid = username.invalid() && username.touched();
            <div z-field [attr.data-invalid]="usernameInvalid || null">
              <label z-field-label for="forms-signal-input-username">Username</label>
              <input
                z-input
                id="forms-signal-input-username"
                autocomplete="username"
                placeholder="shadcn"
                [formField]="profileForm.username"
                [attr.aria-invalid]="usernameInvalid || null"
              />
              <p z-field-description>
                This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
                numbers, and underscores.
              </p>
              @if (usernameInvalid) {
                <z-field-error [zErrors]="username.errors()" />
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-input">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalInputComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ username: '' });

  protected readonly profileForm = form(this.model, schemaPath => {
    required(schemaPath.username, { message: 'Username must be at least 3 characters.' });
    minLength(schemaPath.username, 3, { message: 'Username must be at least 3 characters.' });
    maxLength(schemaPath.username, 10, { message: 'Username must be at most 10 characters.' });
    pattern(schemaPath.username, USERNAME_PATTERN, {
      message: 'Username can only contain letters, numbers, and underscores.',
    });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.profileForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.profileForm().reset({ username: '' });
  }
}
