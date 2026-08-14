import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { applyEach, email, form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const MAX_EMAILS = 5;
const INITIAL_EMAILS = 2;

function createEmails(): { address: string }[] {
  return Array.from({ length: INITIAL_EMAILS }, () => ({ address: '' }));
}

@Component({
  selector: 'z-forms-signal-array',
  imports: [
    FormField,
    NgIcon,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
  ],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header class="border-b">
        <z-card-title>Contact Emails</z-card-title>
        <z-card-description>Manage your contact email addresses.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-array" (submit)="onSubmit($event)">
          <fieldset z-field-set class="gap-4">
            <legend z-field-legend zVariant="label">Email Addresses</legend>
            <p z-field-description>Add up to {{ maxEmails }} email addresses where we can contact you.</p>

            <div z-field-group class="gap-4">
              @for (emailField of contactForm.emails; track $index) {
                @let address = emailField.address();
                @let addressInvalid = address.invalid() && address.touched();
                <div z-field zOrientation="horizontal" [attr.data-invalid]="addressInvalid || null">
                  <div z-field-content>
                    <z-input-group>
                      <input
                        z-input
                        type="email"
                        autocomplete="email"
                        placeholder="name@example.com"
                        [id]="'forms-signal-array-email-' + $index"
                        [formField]="emailField.address"
                        [attr.aria-invalid]="addressInvalid || null"
                      />
                      @if (contactForm.emails.length > 1) {
                        <z-input-group-addon zAlign="inline-end">
                          <button
                            type="button"
                            z-input-group-button
                            zSize="icon-xs"
                            [attr.aria-label]="'Remove email ' + ($index + 1)"
                            (click)="removeEmail($index)"
                          >
                            <ng-icon name="lucideX" />
                          </button>
                        </z-input-group-addon>
                      }
                    </z-input-group>
                    @if (addressInvalid) {
                      <z-field-error [zErrors]="address.errors()" />
                    }
                  </div>
                </div>
              }
            </div>

            @let emailsErrors = contactForm.emails().errors();
            @if (emailsErrors.length > 0) {
              <z-field-error [zErrors]="emailsErrors" />
            }

            <button
              z-button
              type="button"
              zType="outline"
              zSize="sm"
              class="w-full"
              [zDisabled]="contactForm.emails.length >= maxEmails"
              (click)="addEmail()"
            >
              Add Email Address
            </button>
          </fieldset>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-array">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalArrayComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly maxEmails = MAX_EMAILS;

  private readonly model = signal<{ emails: { address: string }[] }>({ emails: createEmails() });

  protected readonly contactForm = form(this.model, schemaPath => {
    minLength(schemaPath.emails, 1, { message: 'Add at least one email address.' });
    maxLength(schemaPath.emails, MAX_EMAILS, { message: `You can add up to ${MAX_EMAILS} email addresses.` });

    applyEach(schemaPath.emails, entry => {
      required(entry.address, { message: 'Enter a valid email address.' });
      email(entry.address, { message: 'Enter a valid email address.' });
    });
  });

  protected addEmail(): void {
    this.model.update(model => ({ ...model, emails: [...model.emails, { address: '' }] }));
  }

  protected removeEmail(index: number): void {
    this.model.update(model => ({ ...model, emails: model.emails.filter((_, i) => i !== index) }));
  }

  protected onReset(): void {
    // `reset(value)` writes the value back into the model and clears touched/dirty in one call.
    this.contactForm().reset({ emails: createEmails() });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.contactForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }
}
