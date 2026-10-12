import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@zard/components/field';
import { ZardRadioGroupImports } from '@zard/components/radio-group';

import { ExampleImports } from './example.component';

const BASIC = [
  { value: 'default', id: 'r1', label: 'Default' },
  { value: 'comfortable', id: 'r2', label: 'Comfortable' },
  { value: 'compact', id: 'r3', label: 'Compact' },
] as const;

const PLANS = [
  { value: 'plus', id: 'plus-plan', title: 'Plus', description: 'For individuals and small teams' },
  { value: 'pro', id: 'pro-plan', title: 'Pro', description: 'For growing businesses' },
  { value: 'enterprise', id: 'enterprise-plan', title: 'Enterprise', description: 'For large teams and enterprises' },
] as const;

const BATTERY = [
  { value: 'high', id: 'battery-high', label: 'High' },
  { value: 'medium', id: 'battery-medium', label: 'Medium' },
  { value: 'low', id: 'battery-low', label: 'Low' },
] as const;

const SIZES = [
  { value: 'small', id: 'size-small', label: 'Small' },
  { value: 'medium', id: 'size-medium', label: 'Medium' },
  { value: 'large', id: 'size-large', label: 'Large' },
  { value: 'xlarge', id: 'size-xlarge', label: 'X-Large' },
] as const;

const DISABLED = [
  { value: 'option1', id: 'disabled-1', label: 'Option 1' },
  { value: 'option2', id: 'disabled-2', label: 'Option 2' },
  { value: 'option3', id: 'disabled-3', label: 'Option 3' },
] as const;

const NOTIFICATIONS = [
  { value: 'email', id: 'invalid-email', label: 'Email only' },
  { value: 'sms', id: 'invalid-sms', label: 'SMS only' },
  { value: 'both', id: 'invalid-both', label: 'Both Email & SMS' },
] as const;

/** shadcn/ui's `radio-group-example`, in zard. */
@Component({
  selector: 'z-radio-group-example',
  imports: [ExampleImports, ZardFieldImports, ZardRadioGroupImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-radio-group value="comfortable">
          @for (option of basic; track option.value) {
            <div z-field zOrientation="horizontal">
              <z-radio [value]="option.value" [zId]="option.id" />
              <label z-field-label [for]="option.id" class="font-normal">{{ option.label }}</label>
            </div>
          }
        </z-radio-group>
      </z-example>

      <z-example zTitle="With Descriptions">
        <z-radio-group value="plus">
          @for (plan of plans; track plan.value) {
            <label z-field-label [for]="plan.id">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div class="font-medium">{{ plan.title }}</div>
                  <p z-field-description>{{ plan.description }}</p>
                </div>
                <z-radio [value]="plan.value" [zId]="plan.id" />
              </div>
            </label>
          }
        </z-radio-group>
      </z-example>

      <z-example zTitle="With FieldSet">
        <fieldset z-field-set>
          <legend z-field-legend>Battery Level</legend>
          <p z-field-description>Choose your preferred battery level.</p>
          <z-radio-group value="medium">
            @for (option of battery; track option.value) {
              <div z-field zOrientation="horizontal">
                <z-radio [value]="option.value" [zId]="option.id" />
                <label z-field-label [for]="option.id" class="font-normal">{{ option.label }}</label>
              </div>
            }
          </z-radio-group>
        </fieldset>
      </z-example>

      <z-example zTitle="Grid Layout">
        <z-radio-group value="medium" class="grid grid-cols-2 gap-2">
          @for (option of sizes; track option.value) {
            <label z-field-label [for]="option.id">
              <div z-field zOrientation="horizontal">
                <z-radio [value]="option.value" [zId]="option.id" />
                <div class="font-medium">{{ option.label }}</div>
              </div>
            </label>
          }
        </z-radio-group>
      </z-example>

      <z-example zTitle="Disabled">
        <z-radio-group value="option2" zDisabled>
          @for (option of disabled; track option.value) {
            <div z-field zOrientation="horizontal">
              <z-radio [value]="option.value" [zId]="option.id" />
              <label z-field-label [for]="option.id" class="font-normal">{{ option.label }}</label>
            </div>
          }
        </z-radio-group>
      </z-example>

      <z-example zTitle="Invalid">
        <fieldset z-field-set>
          <legend z-field-legend>Notification Preferences</legend>
          <p z-field-description>Choose how you want to receive notifications.</p>
          <z-radio-group value="email">
            @for (option of notifications; track option.value) {
              <div z-field zOrientation="horizontal" data-invalid>
                <z-radio [value]="option.value" [zId]="option.id" zInvalid />
                <label z-field-label [for]="option.id" class="font-normal">{{ option.label }}</label>
              </div>
            }
          </z-radio-group>
        </fieldset>
      </z-example>
    </z-example-wrapper>
  `,
})
export class RadioGroupExampleComponent {
  protected readonly basic = BASIC;
  protected readonly plans = PLANS;
  protected readonly battery = BATTERY;
  protected readonly sizes = SIZES;
  protected readonly disabled = DISABLED;
  protected readonly notifications = NOTIFICATIONS;
}
