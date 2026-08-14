import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

type EmailGroup = FormGroup<{ address: FormControl<string> }>;

function createEmailGroup(): EmailGroup {
  return new FormGroup({
    address: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });
}

@Component({
  selector: 'z-forms-reactive-array',
  imports: [
    NgIcon,
    ReactiveFormsModule,
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
        <form novalidate id="forms-reactive-array" [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <fieldset z-field-set class="gap-4">
            <legend z-field-legend zVariant="label">Email Addresses</legend>
            <p z-field-description>Add up to {{ maxEmails }} email addresses where we can contact you.</p>

            <div z-field-group class="gap-4" formArrayName="emails">
              @for (group of emails.controls; track group; let index = $index) {
                @let address = group.controls.address;
                @let addressInvalid = address.invalid && address.touched;
                <div
                  z-field
                  zOrientation="horizontal"
                  [formGroupName]="index"
                  [attr.data-invalid]="addressInvalid || null"
                >
                  <div z-field-content>
                    <z-input-group>
                      <input
                        z-input
                        type="email"
                        formControlName="address"
                        autocomplete="email"
                        placeholder="name@example.com"
                        [id]="'forms-reactive-array-email-' + index"
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

            @if (emails.hasError('minlength') || emails.hasError('maxlength')) {
              <z-field-error>
                @if (emails.hasError('minlength')) {
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
          <button z-button type="submit" form="forms-reactive-array">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveArrayComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly maxEmails = MAX_EMAILS;

  protected readonly contactForm = new FormGroup({
    emails: new FormArray<EmailGroup>(Array.from({ length: INITIAL_EMAILS }, createEmailGroup), [
      Validators.minLength(1),
      Validators.maxLength(MAX_EMAILS),
    ]),
  });

  protected get emails(): FormArray<EmailGroup> {
    return this.contactForm.controls.emails;
  }

  protected addEmail(): void {
    if (this.emails.length >= MAX_EMAILS) return;
    this.emails.push(createEmailGroup());
  }

  protected removeEmail(index: number): void {
    if (this.emails.length <= 1) return;
    this.emails.removeAt(index);
  }

  protected onReset(): void {
    this.emails.clear();
    for (let index = 0; index < INITIAL_EMAILS; index++) {
      this.emails.push(createEmailGroup());
    }
    this.contactForm.reset();
  }

  protected onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.contactForm.getRawValue(), null, 2),
    });
  }
}
