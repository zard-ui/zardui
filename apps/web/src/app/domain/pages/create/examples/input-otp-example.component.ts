import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputOtpImports } from '@zard/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from '@zard/components/input-otp/input-otp.utils';

import { ExampleImports } from './example.component';

/**
 * shadcn sizes the slots of the "Form" example per style. zard draws each slot as an `<input>` inside the
 * `[data-slot=input-otp-slot]` host, so the same sizes target that input.
 */
const FORM_SLOT_CLASSES = [
  '[&_[data-slot=input-otp-slot]>input]:text-xl',
  'style-vega:[&_[data-slot=input-otp-slot]>input]:h-16 style-vega:[&_[data-slot=input-otp-slot]>input]:w-12',
  'style-nova:[&_[data-slot=input-otp-slot]>input]:h-12 style-nova:[&_[data-slot=input-otp-slot]>input]:w-11',
  'style-lyra:[&_[data-slot=input-otp-slot]>input]:h-12 style-lyra:[&_[data-slot=input-otp-slot]>input]:w-11',
  'style-maia:[&_[data-slot=input-otp-slot]>input]:h-16 style-maia:[&_[data-slot=input-otp-slot]>input]:w-12',
  'style-mira:[&_[data-slot=input-otp-slot]>input]:h-12 style-mira:[&_[data-slot=input-otp-slot]>input]:w-11',
  'style-luma:[&_[data-slot=input-otp-slot]>input]:h-16 style-luma:[&_[data-slot=input-otp-slot]>input]:w-12',
  'style-sera:[&_[data-slot=input-otp-slot]>input]:h-14 style-sera:[&_[data-slot=input-otp-slot]>input]:w-10',
].join(' ');

const INVALID_ERRORS = [{ message: 'Invalid code. Please try again.' }] as const;

/** shadcn/ui's `input-otp-example`, in zard. */
@Component({
  selector: 'z-input-otp-example',
  imports: [
    ExampleImports,
    FormsModule,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputOtpImports,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRefreshCw })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Form">
        <z-card class="mx-auto max-w-md">
          <z-card-header>
            <z-card-title zTitle="Verify your login" />
            <z-card-description [zDescription]="formDescription" />
            <ng-template #formDescription>
              Enter the verification code we sent to your email address:
              <span class="font-medium">m&#64;example.com</span>
              .
            </ng-template>
          </z-card-header>
          <z-card-content>
            <form (submit)="$event.preventDefault()">
              <div z-field>
                <div class="flex items-center justify-between">
                  <label z-field-label for="otp-verification">Verification code</label>
                  <button z-button type="button" zType="outline" zSize="xs">
                    <ng-icon name="lucideRefreshCw" data-icon="inline-start" />
                    Resend Code
                  </button>
                </div>
                <z-input-otp id="otp-verification" [zMaxLength]="6">
                  <z-input-otp-group [class]="formSlotClasses">
                    <z-input-otp-slot [zIndex]="0" />
                    <z-input-otp-slot [zIndex]="1" />
                    <z-input-otp-slot [zIndex]="2" />
                  </z-input-otp-group>
                  <z-input-otp-separator />
                  <z-input-otp-group [class]="formSlotClasses">
                    <z-input-otp-slot [zIndex]="3" />
                    <z-input-otp-slot [zIndex]="4" />
                    <z-input-otp-slot [zIndex]="5" />
                  </z-input-otp-group>
                </z-input-otp>
                <p z-field-description>
                  <a href="#">I no longer have access to this email address.</a>
                </p>
              </div>
            </form>
          </z-card-content>
          <z-card-footer class="flex-col gap-2">
            <button z-button type="submit" class="w-full">Verify</button>
            <div class="text-muted-foreground text-sm">
              Having trouble signing in?
              <a href="#" class="hover:text-primary underline underline-offset-4 transition-colors">Contact support</a>
            </div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Simple">
        <div z-field>
          <label z-field-label for="simple">Simple</label>
          <z-input-otp id="simple" [zMaxLength]="6">
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
        </div>
      </z-example>

      <z-example zTitle="Digits Only">
        <div z-field>
          <label z-field-label for="digits-only">Digits Only</label>
          <z-input-otp id="digits-only" [zMaxLength]="6" [zPattern]="digitsOnly">
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="0" />
              <z-input-otp-slot [zIndex]="1" />
              <z-input-otp-slot [zIndex]="2" />
              <z-input-otp-slot [zIndex]="3" />
              <z-input-otp-slot [zIndex]="4" />
              <z-input-otp-slot [zIndex]="5" />
            </z-input-otp-group>
          </z-input-otp>
        </div>
      </z-example>

      <z-example zTitle="With Separator">
        <div z-field>
          <label z-field-label for="with-separator">With Separator</label>
          <z-input-otp id="with-separator" [zMaxLength]="6" [(ngModel)]="separatorValue">
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="0" />
              <z-input-otp-slot [zIndex]="1" />
            </z-input-otp-group>
            <z-input-otp-separator />
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="2" />
              <z-input-otp-slot [zIndex]="3" />
            </z-input-otp-group>
            <z-input-otp-separator />
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="4" />
              <z-input-otp-slot [zIndex]="5" />
            </z-input-otp-group>
          </z-input-otp>
        </div>
      </z-example>

      <z-example zTitle="Alphanumeric">
        <div z-field>
          <label z-field-label for="alphanumeric">Alphanumeric</label>
          <p z-field-description>Accepts both letters and numbers.</p>
          <z-input-otp id="alphanumeric" [zMaxLength]="6" [zPattern]="digitsAndChars" [zIntegerOnly]="false">
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
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <div z-field>
          <label z-field-label for="disabled">Disabled</label>
          <z-input-otp id="disabled" [zMaxLength]="6" [ngModel]="disabledValue" [disabled]="true">
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
        </div>
      </z-example>

      <z-example zTitle="4 Digits">
        <div z-field>
          <label z-field-label for="four-digits">4 Digits</label>
          <p z-field-description>Common pattern for PIN codes.</p>
          <z-input-otp id="four-digits" [zMaxLength]="4" [zPattern]="digitsOnly">
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="0" />
              <z-input-otp-slot [zIndex]="1" />
              <z-input-otp-slot [zIndex]="2" />
              <z-input-otp-slot [zIndex]="3" />
            </z-input-otp-group>
          </z-input-otp>
        </div>
      </z-example>

      <z-example zTitle="Invalid State">
        <div z-field>
          <label z-field-label for="invalid">Invalid State</label>
          <p z-field-description>Example showing the invalid error state.</p>
          <z-input-otp id="invalid" [zMaxLength]="6" [(ngModel)]="invalidValue">
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="0" zInvalid />
              <z-input-otp-slot [zIndex]="1" zInvalid />
            </z-input-otp-group>
            <z-input-otp-separator />
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="2" zInvalid />
              <z-input-otp-slot [zIndex]="3" zInvalid />
            </z-input-otp-group>
            <z-input-otp-separator />
            <z-input-otp-group>
              <z-input-otp-slot [zIndex]="4" zInvalid />
              <z-input-otp-slot [zIndex]="5" zInvalid />
            </z-input-otp-group>
          </z-input-otp>
          <z-field-error [zErrors]="invalidErrors" />
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class InputOtpExampleComponent {
  protected readonly formSlotClasses = FORM_SLOT_CLASSES;
  protected readonly digitsOnly = REGEXP_ONLY_DIGITS;
  protected readonly digitsAndChars = REGEXP_ONLY_DIGITS_AND_CHARS;
  protected readonly invalidErrors = INVALID_ERRORS;
  protected readonly disabledValue = '123456';

  protected readonly separatorValue = signal('123456');
  protected readonly invalidValue = signal('000000');
}
