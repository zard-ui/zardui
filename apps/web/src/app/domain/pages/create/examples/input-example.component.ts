import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSelectImports } from '@zard/components/select/select.imports';

import { ExampleImports } from './example.component';

/** shadcn/ui's `input-example`, in zard. "With Native Select" is left out: zard has no NativeSelect. */
@Component({
  selector: 'z-input-example',
  imports: [ExampleImports, ZardButtonComponent, ZardFieldImports, ZardInputComponent, ZardSelectImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <input z-input type="email" placeholder="Email" />
      </z-example>

      <z-example zTitle="Invalid">
        <input z-input type="text" placeholder="Error" aria-invalid="true" />
      </z-example>

      <z-example zTitle="With Label">
        <div z-field>
          <label z-field-label for="input-demo-email">Email</label>
          <input z-input id="input-demo-email" type="email" placeholder="name@example.com" />
        </div>
      </z-example>

      <z-example zTitle="With Description">
        <div z-field>
          <label z-field-label for="input-demo-username">Username</label>
          <input z-input id="input-demo-username" type="text" placeholder="Enter your username" />
          <p z-field-description>Choose a unique username for your account.</p>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <div z-field>
          <label z-field-label for="input-demo-disabled">Email</label>
          <input z-input id="input-demo-disabled" type="email" placeholder="Email" disabled />
        </div>
      </z-example>

      <z-example zTitle="Input Types">
        <div class="flex w-full flex-col gap-6">
          <div z-field>
            <label z-field-label for="input-demo-password">Password</label>
            <input z-input id="input-demo-password" type="password" placeholder="Password" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-tel">Phone</label>
            <input z-input id="input-demo-tel" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-url">URL</label>
            <input z-input id="input-demo-url" type="url" placeholder="https://example.com" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-search">Search</label>
            <input z-input id="input-demo-search" type="search" placeholder="Search" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-number">Number</label>
            <input z-input id="input-demo-number" type="number" placeholder="123" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-date">Date</label>
            <input z-input id="input-demo-date" type="date" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-time">Time</label>
            <input z-input id="input-demo-time" type="time" />
          </div>
          <div z-field>
            <label z-field-label for="input-demo-file">File</label>
            <input z-input id="input-demo-file" type="file" />
          </div>
        </div>
      </z-example>

      <z-example zTitle="With Select">
        <div class="flex w-full gap-2">
          <input z-input type="text" placeholder="Enter amount" class="flex-1" />
          <z-select class="w-32" zValue="usd">
            <z-select-group>
              <z-select-item zValue="usd">USD</z-select-item>
              <z-select-item zValue="eur">EUR</z-select-item>
              <z-select-item zValue="gbp">GBP</z-select-item>
            </z-select-group>
          </z-select>
        </div>
      </z-example>

      <z-example zTitle="With Button">
        <div class="flex w-full gap-2">
          <input z-input type="search" placeholder="Search..." class="flex-1" />
          <button z-button>Search</button>
        </div>
      </z-example>

      <z-example zTitle="Form">
        <form class="w-full" (submit)="$event.preventDefault()">
          <div z-field-group>
            <div z-field>
              <label z-field-label for="form-name">Name</label>
              <input z-input id="form-name" type="text" placeholder="John Doe" />
            </div>
            <div z-field>
              <label z-field-label for="form-email">Email</label>
              <input z-input id="form-email" type="email" placeholder="john@example.com" />
              <p z-field-description>We'll never share your email with anyone.</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div z-field>
                <label z-field-label for="form-phone">Phone</label>
                <input z-input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              <div z-field>
                <label for="input-country-122" z-field-label>Country</label>
                <z-select id="input-country-122" zValue="us">
                  <z-select-group>
                    <z-select-item zValue="us">United States</z-select-item>
                    <z-select-item zValue="uk">United Kingdom</z-select-item>
                    <z-select-item zValue="ca">Canada</z-select-item>
                  </z-select-group>
                </z-select>
              </div>
            </div>
            <div z-field>
              <label z-field-label for="form-address">Address</label>
              <input z-input id="form-address" type="text" placeholder="123 Main St" />
            </div>
            <div z-field zOrientation="horizontal">
              <button z-button type="button" zType="outline">Cancel</button>
              <button z-button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </z-example>
    </z-example-wrapper>
  `,
})
export class InputExampleComponent {}
