import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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
  selector: 'z-forms-template-array',
  imports: [
    FormsModule,
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
        <form novalidate id="forms-template-array" #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)">
          <fieldset z-field-set class="gap-4">
            <legend z-field-legend zVariant="label">Email Addresses</legend>
            <p z-field-description>Add up to {{ maxEmails }} email addresses where we can contact you.</p>

            <div z-field-group class="gap-4">
              @for (entry of emails; track entry; let index = $index) {
                @let control = contactForm.controls['email-' + index];
                @let addressInvalid = !!control && control.invalid && control.touched;
                <div z-field zOrientation="horizontal" [attr.data-invalid]="addressInvalid || null">
                  <div z-field-content>
                    <z-input-group>
                      <input
                        z-input
                        required
                        email
                        type="email"
                        autocomplete="email"
                        placeholder="name@example.com"
                        [name]="'email-' + index"
                        [id]="'forms-template-array-email-' + index"
                        [(ngModel)]="entry.address"
                        [attr.aria-invalid]="addressInvalid || null"
                      />
                      @if (emails.length > 1) {
                        <z-input-group-addon zAlign="inline-end">
                          <button
                            type="button"
                            z-input-group-button
                            zSize="icon-xs"
                            [attr.aria-label]="'Remove email ' + (index + 1)"
                            (click)="removeEmail(index)"
                          >
                            <ng-icon name="lucideX" />
                          </button>
                        </z-input-group-addon>
                      }
                    </z-input-group>
                    @if (addressInvalid) {
                      <z-field-error>Enter a valid email address.</z-field-error>
                    }
                  </div>
                </div>
              }
            </div>

            @if (emails.length < 1 || emails.length > maxEmails) {
              <z-field-error>
                @if (emails.length < 1) {
                  Add at least one email address.
                } @else {
                  You can add up to {{ maxEmails }} email addresses.
                }
              </z-field-error>
            }

            <button
              z-button
              type="button"
              zType="outline"
              zSize="sm"
              class="w-full"
              [zDisabled]="emails.length >= maxEmails"
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
          <button z-button type="submit" form="forms-template-array">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateArrayComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly maxEmails = MAX_EMAILS;

  /** Each entry keeps a stable object identity so `track` survives insert/remove. */
  protected emails = createEmails();

  protected addEmail(): void {
    if (this.emails.length >= MAX_EMAILS) return;
    this.emails = [...this.emails, { address: '' }];
  }

  protected removeEmail(index: number): void {
    if (this.emails.length <= 1) return;
    this.emails = this.emails.filter((_, position) => position !== index);
  }

  /** Fresh entries mean fresh controls — the form starts clean without touching `NgForm`. */
  protected onReset(): void {
    this.emails = createEmails();
  }

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify({ emails: this.emails }, null, 2),
    });
  }
}
