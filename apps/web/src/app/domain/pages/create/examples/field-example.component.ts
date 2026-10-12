import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCheckboxComponent } from '@zard/components/checkbox';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputOtpImports } from '@zard/components/input-otp';
import { ZardRadioGroupImports } from '@zard/components/radio-group';
import { ZardSelectImports } from '@zard/components/select';
import { ZardSliderComponent } from '@zard/components/slider';
import { ZardSwitchComponent } from '@zard/components/switch';
import { ZardTextareaComponent } from '@zard/components/textarea';

import { ExampleImports } from './example.component';

const OPTIONS = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
] as const;

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
] as const;

const TIMEZONES = [
  { value: 'utc', label: 'UTC' },
  { value: 'est', label: 'Eastern Time' },
  { value: 'pst', label: 'Pacific Time' },
] as const;

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
] as const;

const PREFERENCES = [
  { id: 'pref-dark', label: 'Dark mode' },
  { id: 'pref-compact', label: 'Compact view' },
  { id: 'pref-notifications', label: 'Enable notifications' },
] as const;

const PLANS = [
  { value: 'free', id: 'radio-free', label: 'Free Plan' },
  { value: 'pro', id: 'radio-pro', label: 'Pro Plan' },
  { value: 'enterprise', id: 'radio-enterprise', label: 'Enterprise' },
] as const;

const BATTERY = [
  { value: 'high', id: 'battery-high', label: 'High' },
  { value: 'medium', id: 'battery-medium', label: 'Medium' },
  { value: 'low', id: 'battery-low', label: 'Low' },
] as const;

const SIX_SLOTS = [0, 1, 2, 3, 4, 5] as const;

/** shadcn/ui's `field-example`, in zard. */
@Component({
  selector: 'z-field-example',
  imports: [
    FormsModule,
    ExampleImports,
    ZardBadgeComponent,
    ZardCheckboxComponent,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputOtpImports,
    ZardRadioGroupImports,
    ZardSelectImports,
    ZardSliderComponent,
    ZardSwitchComponent,
    ZardTextareaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Input Fields">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="input-basic">Basic Input</label>
            <input z-input id="input-basic" placeholder="Enter text" />
          </div>
          <div z-field>
            <label z-field-label for="input-with-desc">Input with Description</label>
            <input z-input id="input-with-desc" placeholder="Enter your username" />
            <p z-field-description>Choose a unique username for your account.</p>
          </div>
          <div z-field>
            <label z-field-label for="input-desc-first">Email Address</label>
            <p z-field-description>We'll never share your email with anyone.</p>
            <input z-input id="input-desc-first" type="email" placeholder="email@example.com" />
          </div>
          <div z-field>
            <label z-field-label for="input-required">
              Required Field
              <span class="text-destructive">*</span>
            </label>
            <input z-input id="input-required" placeholder="This field is required" required />
            <p z-field-description>This field must be filled out.</p>
          </div>
          <div z-field>
            <label z-field-label for="input-disabled">Disabled Input</label>
            <input z-input id="input-disabled" placeholder="Cannot edit" disabled />
            <p z-field-description>This field is currently disabled.</p>
          </div>
          <div z-field>
            <label z-field-label for="input-badge">
              Input with Badge
              <z-badge zType="secondary" class="ml-auto">Recommended</z-badge>
            </label>
            <input z-input id="input-badge" placeholder="Enter value" />
          </div>
          <div z-field data-invalid>
            <label z-field-label for="input-invalid">Invalid Input</label>
            <input z-input id="input-invalid" placeholder="This field has an error" aria-invalid="true" />
            <p z-field-description>This field contains validation errors.</p>
          </div>
          <div z-field data-disabled>
            <label z-field-label for="input-disabled-field">Disabled Field</label>
            <input z-input id="input-disabled-field" placeholder="Cannot edit" disabled />
            <p z-field-description>This field is currently disabled.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Textarea Fields">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="textarea-basic">Basic Textarea</label>
            <textarea z-textarea id="textarea-basic" placeholder="Enter your message"></textarea>
          </div>
          <div z-field>
            <label z-field-label for="textarea-comments">Comments</label>
            <textarea
              z-textarea
              id="textarea-comments"
              placeholder="Share your thoughts..."
              class="min-h-[100px]"
            ></textarea>
            <p z-field-description>Maximum 500 characters allowed.</p>
          </div>
          <div z-field>
            <label z-field-label for="textarea-bio">Bio</label>
            <p z-field-description>Tell us about yourself in a few sentences.</p>
            <textarea z-textarea id="textarea-bio" placeholder="I am a..." class="min-h-[120px]"></textarea>
          </div>
          <div z-field>
            <label z-field-label for="textarea-desc-after">Message</label>
            <textarea z-textarea id="textarea-desc-after" placeholder="Enter your message"></textarea>
            <p z-field-description>Enter your message so it is long enough to test the layout.</p>
          </div>
          <div z-field data-invalid>
            <label z-field-label for="textarea-invalid">Invalid Textarea</label>
            <textarea
              z-textarea
              id="textarea-invalid"
              placeholder="This field has an error"
              aria-invalid="true"
            ></textarea>
            <p z-field-description>This field contains validation errors.</p>
          </div>
          <div z-field data-disabled>
            <label z-field-label for="textarea-disabled-field">Disabled Field</label>
            <textarea z-textarea id="textarea-disabled-field" placeholder="Cannot edit" disabled></textarea>
            <p z-field-description>This field is currently disabled.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Select Fields">
        <div z-field-group>
          <div z-field>
            <label for="field-basic-select-177" z-field-label>Basic Select</label>
            <z-select id="field-basic-select-177" zPlaceholder="Choose an option" zPosition="popper">
              <z-select-group>
                @for (option of options; track option.value) {
                  <z-select-item [zValue]="option.value">{{ option.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </div>
          <div z-field>
            <label for="field-country-187" z-field-label>Country</label>
            <z-select id="field-country-187" zPlaceholder="Select your country" zPosition="popper">
              <z-select-group>
                @for (country of countries; track country.value) {
                  <z-select-item [zValue]="country.value">{{ country.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
            <p z-field-description>Select the country where you currently reside.</p>
          </div>
          <div z-field>
            <label for="field-timezone-198" z-field-label>Timezone</label>
            <p z-field-description>Choose your local timezone for accurate scheduling.</p>
            <z-select id="field-timezone-198" zPlaceholder="Select timezone" zPosition="popper">
              <z-select-group>
                @for (timezone of timezones; track timezone.value) {
                  <z-select-item [zValue]="timezone.value">{{ timezone.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </div>
          <div z-field data-invalid>
            <label for="field-invalid-select-209" z-field-label>Invalid Select</label>
            <z-select id="field-invalid-select-209" zPlaceholder="This field has an error" zPosition="popper" zInvalid>
              <z-select-group>
                @for (option of options; track option.value) {
                  <z-select-item [zValue]="option.value">{{ option.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
            <p z-field-description>This field contains validation errors.</p>
          </div>
          <div z-field data-disabled>
            <label for="field-disabled-field-220" z-field-label>Disabled Field</label>
            <z-select id="field-disabled-field-220" zPlaceholder="Cannot select" zPosition="popper" zDisabled>
              <z-select-group>
                @for (option of options; track option.value) {
                  <z-select-item [zValue]="option.value">{{ option.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
            <p z-field-description>This field is currently disabled.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Checkbox Fields">
        <div z-field-group>
          <div z-field zOrientation="horizontal">
            <z-checkbox zId="checkbox-basic" [ngModel]="true" />
            <label z-field-label for="checkbox-basic">I agree to the terms and conditions</label>
          </div>
          <div z-field zOrientation="horizontal">
            <label z-field-label for="checkbox-right">Accept terms and conditions</label>
            <z-checkbox zId="checkbox-right" />
          </div>
          <div z-field zOrientation="horizontal">
            <z-checkbox zId="checkbox-with-desc" />
            <div z-field-content>
              <label z-field-label for="checkbox-with-desc">Subscribe to newsletter</label>
              <p z-field-description>Receive weekly updates about new features and promotions.</p>
            </div>
          </div>
          <label z-field-label for="checkbox-with-title">
            <div z-field zOrientation="horizontal">
              <z-checkbox zId="checkbox-with-title" />
              <div z-field-content>
                <div z-field-title>Enable Touch ID</div>
                <p z-field-description>Enable Touch ID to quickly unlock your device.</p>
              </div>
            </div>
          </label>
          <fieldset z-field-set>
            <legend z-field-legend zVariant="label">Preferences</legend>
            <p z-field-description>Select all that apply to customize your experience.</p>
            <div z-field-group class="gap-3">
              @for (preference of preferences; track preference.id) {
                <div z-field zOrientation="horizontal">
                  <z-checkbox [zId]="preference.id" />
                  <label z-field-label [for]="preference.id">{{ preference.label }}</label>
                </div>
              }
            </div>
          </fieldset>
          <div z-field data-invalid zOrientation="horizontal">
            <z-checkbox zId="checkbox-invalid" zInvalid />
            <label z-field-label for="checkbox-invalid">Invalid checkbox</label>
          </div>
          <div z-field data-disabled zOrientation="horizontal">
            <z-checkbox zId="checkbox-disabled-field" zDisabled />
            <label z-field-label for="checkbox-disabled-field">Disabled checkbox</label>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Radio Fields">
        <div z-field-group>
          <fieldset z-field-set>
            <legend z-field-legend zVariant="label">Subscription Plan</legend>
            <z-radio-group value="free">
              @for (plan of plans; track plan.value) {
                <div z-field zOrientation="horizontal">
                  <z-radio [value]="plan.value" [zId]="plan.id" />
                  <label z-field-label [for]="plan.id">{{ plan.label }}</label>
                </div>
              }
            </z-radio-group>
          </fieldset>
          <fieldset z-field-set>
            <legend z-field-legend zVariant="label">Battery Level</legend>
            <p z-field-description>Choose your preferred battery level.</p>
            <z-radio-group>
              @for (option of battery; track option.value) {
                <div z-field zOrientation="horizontal">
                  <z-radio [value]="option.value" [zId]="option.id" />
                  <label z-field-label [for]="option.id">{{ option.label }}</label>
                </div>
              }
            </z-radio-group>
          </fieldset>
          <z-radio-group class="gap-6">
            <div z-field zOrientation="horizontal">
              <z-radio value="option1" zId="radio-content-1" />
              <div z-field-content>
                <label z-field-label for="radio-content-1">Enable Touch ID</label>
                <p z-field-description>Enable Touch ID to quickly unlock your device.</p>
              </div>
            </div>
          </z-radio-group>
          <z-radio-group class="gap-3">
            <label z-field-label for="radio-title-1">
              <div z-field zOrientation="horizontal">
                <z-radio value="title1" zId="radio-title-1" />
                <div z-field-content>
                  <div z-field-title>Enable Touch ID</div>
                  <p z-field-description>Enable Touch ID to quickly unlock your device.</p>
                </div>
              </div>
            </label>
          </z-radio-group>
          <fieldset z-field-set>
            <legend z-field-legend zVariant="label">Invalid Radio Group</legend>
            <z-radio-group>
              <div z-field data-invalid zOrientation="horizontal">
                <z-radio value="invalid1" zId="radio-invalid-1" zInvalid />
                <label z-field-label for="radio-invalid-1">Invalid Option 1</label>
              </div>
              <div z-field data-invalid zOrientation="horizontal">
                <z-radio value="invalid2" zId="radio-invalid-2" zInvalid />
                <label z-field-label for="radio-invalid-2">Invalid Option 2</label>
              </div>
            </z-radio-group>
          </fieldset>
          <fieldset z-field-set>
            <legend z-field-legend zVariant="label">Disabled Radio Group</legend>
            <z-radio-group zDisabled>
              <div z-field data-disabled zOrientation="horizontal">
                <z-radio value="disabled1" zId="radio-disabled-1" zDisabled />
                <label z-field-label for="radio-disabled-1">Disabled Option 1</label>
              </div>
              <div z-field data-disabled zOrientation="horizontal">
                <z-radio value="disabled2" zId="radio-disabled-2" zDisabled />
                <label z-field-label for="radio-disabled-2">Disabled Option 2</label>
              </div>
            </z-radio-group>
          </fieldset>
        </div>
      </z-example>

      <z-example zTitle="Switch Fields">
        <div z-field-group>
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="switch-airplane">Airplane Mode</label>
              <p z-field-description>Turn on airplane mode to disable all connections.</p>
            </div>
            <z-switch zId="switch-airplane" />
          </div>
          <div z-field zOrientation="horizontal">
            <label z-field-label for="switch-dark">Dark Mode</label>
            <z-switch zId="switch-dark" />
          </div>
          <div z-field zOrientation="horizontal">
            <z-switch zId="switch-marketing" />
            <div z-field-content>
              <label z-field-label for="switch-marketing">Marketing Emails</label>
              <p z-field-description>Receive emails about new products, features, and more.</p>
            </div>
          </div>
          <div z-field>
            <z-field-label>Privacy Settings</z-field-label>
            <p z-field-description>Manage your privacy preferences.</p>
            <div z-field zOrientation="horizontal">
              <z-switch zId="switch-profile" [zChecked]="true" />
              <label z-field-label for="switch-profile">Make profile visible to others</label>
            </div>
            <div z-field zOrientation="horizontal">
              <z-switch zId="switch-email" />
              <label z-field-label for="switch-email">Show email on profile</label>
            </div>
          </div>
          <div z-field data-invalid zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="switch-invalid">Invalid Switch</label>
              <p z-field-description>This switch has validation errors.</p>
            </div>
            <z-switch zId="switch-invalid" zInvalid />
          </div>
          <div z-field data-disabled zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="switch-disabled-field">Disabled Switch</label>
              <p z-field-description>This switch is currently disabled.</p>
            </div>
            <z-switch zId="switch-disabled-field" zDisabled />
          </div>
        </div>
      </z-example>

      <z-example zTitle="Slider Fields">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="slider-volume">Volume</label>
            <z-slider
              id="slider-volume"
              zMax="100"
              zStep="1"
              [zValue]="volume()"
              (zSlideIndexChange)="volume.set($event)"
            />
          </div>
          <div z-field>
            <label z-field-label for="slider-brightness">Screen Brightness</label>
            <z-slider
              id="slider-brightness"
              zMax="100"
              zStep="5"
              [zValue]="brightness()"
              (zSlideIndexChange)="brightness.set($event)"
            />
            <p z-field-description>Current brightness: {{ brightness()[0] }}%</p>
          </div>
          <div z-field>
            <label z-field-label for="slider-quality">Video Quality</label>
            <p z-field-description>Higher quality uses more bandwidth.</p>
            <z-slider id="slider-quality" zMin="360" zMax="1080" zStep="360" [zDefault]="[720]" />
          </div>
          <div z-field>
            <label z-field-label for="slider-temperature">Temperature Range</label>
            <z-slider
              id="slider-temperature"
              zMin="0"
              zMax="1"
              zStep="0.1"
              [zValue]="temperature()"
              (zSlideIndexChange)="setTemperature($event)"
            />
            <p z-field-description>Range: {{ temperature()[0].toFixed(1) }} - {{ temperature()[1].toFixed(1) }}</p>
          </div>
          <div z-field>
            <label z-field-label for="slider-price-range">Price Range</label>
            <z-slider
              id="slider-price-range"
              zMax="100"
              zStep="5"
              [zValue]="priceRange()"
              (zSlideIndexChange)="priceRange.set($event)"
            />
            <p z-field-description>\${{ priceRange()[0] }} - \${{ priceRange()[1] }}</p>
          </div>
          <div z-field>
            <label z-field-label for="slider-color-balance">Color Balance</label>
            <z-slider
              id="slider-color-balance"
              zMax="100"
              zStep="10"
              [zValue]="colorBalance()"
              (zSlideIndexChange)="colorBalance.set($event)"
            />
            <p z-field-description>
              Red: {{ colorBalance()[0] }}%, Green: {{ colorBalance()[1] }}%, Blue: {{ colorBalance()[2] }}%
            </p>
          </div>
          <div z-field data-invalid>
            <label z-field-label for="slider-invalid">Invalid Slider</label>
            <z-slider id="slider-invalid" zMax="100" [zDefault]="[30]" aria-invalid="true" />
            <p z-field-description>This slider has validation errors.</p>
          </div>
          <div z-field data-disabled>
            <label z-field-label for="slider-disabled-field">Disabled Slider</label>
            <z-slider id="slider-disabled-field" zMax="100" [zDefault]="[50]" zDisabled />
            <p z-field-description>This slider is currently disabled.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="OTP Input Fields">
        <div z-field-group>
          <div z-field>
            <label z-field-label for="otp-basic">Verification Code</label>
            <z-input-otp id="otp-basic" [zMaxLength]="6">
              <z-input-otp-group>
                @for (slot of sixSlots; track slot) {
                  <z-input-otp-slot [zIndex]="slot" />
                }
              </z-input-otp-group>
            </z-input-otp>
          </div>
          <div z-field>
            <label z-field-label for="otp-with-desc">Enter OTP</label>
            <z-input-otp id="otp-with-desc" [zMaxLength]="6" [(ngModel)]="otp">
              <z-input-otp-group>
                @for (slot of sixSlots; track slot) {
                  <z-input-otp-slot [zIndex]="slot" />
                }
              </z-input-otp-group>
            </z-input-otp>
            <p z-field-description>Enter the 6-digit code sent to your email.</p>
          </div>
          <div z-field>
            <label z-field-label for="otp-separator">Two-Factor Authentication</label>
            <z-input-otp id="otp-separator" [zMaxLength]="6">
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
            <p z-field-description>Enter the code from your authenticator app.</p>
          </div>
          <div z-field>
            <label z-field-label for="otp-pin">PIN Code</label>
            <z-input-otp id="otp-pin" [zMaxLength]="4" [(ngModel)]="pin">
              <z-input-otp-group>
                <z-input-otp-slot [zIndex]="0" />
                <z-input-otp-slot [zIndex]="1" />
                <z-input-otp-slot [zIndex]="2" />
                <z-input-otp-slot [zIndex]="3" />
              </z-input-otp-group>
            </z-input-otp>
            <p z-field-description>Enter your 4-digit PIN (numbers only).</p>
          </div>
          <div z-field data-invalid>
            <label z-field-label for="otp-invalid">Invalid OTP</label>
            <z-input-otp id="otp-invalid" [zMaxLength]="6">
              <z-input-otp-group>
                @for (slot of sixSlots; track slot) {
                  <z-input-otp-slot [zIndex]="slot" zInvalid />
                }
              </z-input-otp-group>
            </z-input-otp>
            <p z-field-description>This OTP field contains validation errors.</p>
          </div>
          <div z-field data-disabled>
            <label z-field-label for="otp-disabled-field">Disabled OTP</label>
            <z-input-otp id="otp-disabled-field" [zMaxLength]="6" [ngModel]="''" [disabled]="true">
              <z-input-otp-group>
                @for (slot of sixSlots; track slot) {
                  <z-input-otp-slot [zIndex]="slot" />
                }
              </z-input-otp-group>
            </z-input-otp>
            <p z-field-description>This OTP field is currently disabled.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Horizontal Fields">
        <div z-field-group class="**:data-[slot=field-content]:min-w-48">
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="horizontal-input">Username</label>
              <p z-field-description>Enter your preferred username.</p>
            </div>
            <input z-input id="horizontal-input" placeholder="johndoe" />
          </div>
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="horizontal-textarea">Bio</label>
              <p z-field-description>Write a short description about yourself.</p>
            </div>
            <textarea z-textarea id="horizontal-textarea" placeholder="Tell us about yourself..."></textarea>
          </div>
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="horizontal-switch">Email Notifications</label>
              <p z-field-description>Receive email updates about your account.</p>
            </div>
            <z-switch zId="horizontal-switch" />
          </div>
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <label for="field-favorite-fruit-584" z-field-label>Favorite Fruit</label>
              <p z-field-description>Choose your favorite fruit.</p>
            </div>
            <z-select id="field-favorite-fruit-584" zPlaceholder="Select a fruit" zPosition="popper">
              <z-select-group>
                @for (fruit of fruits; track fruit.value) {
                  <z-select-item [zValue]="fruit.value">{{ fruit.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </div>
          <div z-field zOrientation="horizontal">
            <div z-field-content>
              <label z-field-label for="horizontal-slider">Volume</label>
              <p z-field-description>Adjust the volume level.</p>
            </div>
            <z-slider id="horizontal-slider" zMax="100" [zDefault]="[50]" />
          </div>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class FieldExampleComponent {
  protected readonly options = OPTIONS;
  protected readonly countries = COUNTRIES;
  protected readonly timezones = TIMEZONES;
  protected readonly fruits = FRUITS;
  protected readonly preferences = PREFERENCES;
  protected readonly plans = PLANS;
  protected readonly battery = BATTERY;
  protected readonly sixSlots = SIX_SLOTS;

  protected readonly volume = signal([50]);
  protected readonly brightness = signal([75]);
  protected readonly temperature = signal([0.3, 0.7]);
  protected readonly priceRange = signal([25, 75]);
  protected readonly colorBalance = signal([10, 20, 70]);
  protected otp = '';
  protected pin = '';

  protected setTemperature(value: number[]): void {
    this.temperature.set(value.map(v => Math.round(v * 10) / 10));
  }
}
