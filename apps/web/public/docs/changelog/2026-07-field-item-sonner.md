---
title: July 2026 - Field, Item, Textarea and Sonner
description: Four new components this month — Field, Item, Textarea, and Sonner — and a reorganisation that moved every demo and API doc next to the component it documents.
---

# July 2026 - Field, Item, Textarea and Sonner

Four new components this month — Field, Item, Textarea, and Sonner — and a reorganisation that moved every demo and API doc next to the component it documents.

## Toast is now Sonner

The `toast` component has been replaced by `sonner`. Swap `z-toast` / `z-toaster` for `z-sonner`, import `ZardSonnerService` instead of the toast service, and reinstall under the new name. The old component no longer ships.

```
npx zard-cli@latest add sonner
```

## Demos and docs live with the components

Every demo, API reference, and overview moved from the documentation site into `libs/zard/.../components/<name>/`. Nothing changes for you as a consumer — the CLI and the registry are unaffected — but contributing a component is now a single folder.

## New Components

### [Field](/docs/components/field)

Composable building blocks for accessible forms, pairing a control with its label, description, and error message.

```
npx zard-cli@latest add field
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-field-preview',
  imports: [
    ...ZardFieldImports,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputComponent,
    ZardTextareaComponent,
    ZardSelectImports,
    FormsModule,
  ],
  template: `
    <div class="w-full min-w-md">
      <form>
        <div z-field-group>
          <fieldset z-field-set>
            <legend z-field-legend>Payment Method</legend>
            <p z-field-description>All transactions are secure and encrypted.</p>

            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-card-name">Name on Card</label>
                <input z-input id="checkout-card-name" placeholder="Luiz Gomes" zSize="sm" required />
              </div>

              <div z-field>
                <label z-field-label for="checkout-card-number">Card Number</label>
                <input z-input id="checkout-card-number" placeholder="1234 5678 9012 3456" zSize="sm" required />
                <p z-field-description>Enter your 16-digit card number.</p>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div z-field>
                  <label z-field-label for="checkout-exp-month" class="w-fit">Month</label>
                  <z-select id="checkout-exp-month" zPlaceholder="MM" zSize="sm">
                    <z-select-item zValue="01">01</z-select-item>
                    <z-select-item zValue="02">02</z-select-item>
                    <z-select-item zValue="03">03</z-select-item>
                    <z-select-item zValue="04">04</z-select-item>
                    <z-select-item zValue="05">05</z-select-item>
                    <z-select-item zValue="06">06</z-select-item>
                    <z-select-item zValue="07">07</z-select-item>
                    <z-select-item zValue="08">08</z-select-item>
                    <z-select-item zValue="09">09</z-select-item>
                    <z-select-item zValue="10">10</z-select-item>
                    <z-select-item zValue="11">11</z-select-item>
                    <z-select-item zValue="12">12</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-exp-year">Year</label>
                  <z-select id="checkout-exp-year" zPlaceholder="YYYY" zSize="sm">
                    <z-select-item zValue="2024">2024</z-select-item>
                    <z-select-item zValue="2025">2025</z-select-item>
                    <z-select-item zValue="2026">2026</z-select-item>
                    <z-select-item zValue="2027">2027</z-select-item>
                    <z-select-item zValue="2028">2028</z-select-item>
                    <z-select-item zValue="2029">2029</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-cvv">CVV</label>
                  <input z-input id="checkout-cvv" placeholder="123" zSize="sm" required />
                </div>
              </div>
            </div>
          </fieldset>

          <z-field-separator />

          <fieldset z-field-set>
            <legend z-field-legend>Billing Address</legend>
            <p z-field-description>The billing address associated with your payment method.</p>

            <div z-field-group>
              <div z-field zOrientation="horizontal">
                <span
                  z-checkbox
                  zId="checkout-same-as-shipping"
                  [(ngModel)]="sameAsShipping"
                  name="sameAsShipping"
                ></span>
                <label z-field-label for="checkout-same-as-shipping" class="font-normal">
                  Same as shipping address
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset z-field-set>
            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-comments">Comments</label>
                <textarea
                  z-textarea
                  id="checkout-comments"
                  placeholder="Add any additional comments"
                  class="resize-none"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <div z-field zOrientation="horizontal">
            <button z-button type="submit">Submit</button>
            <button z-button zType="outline" type="button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldPreviewComponent {
  protected sameAsShipping = true;
}
```

### [Item](/docs/components/item)

A versatile row for displaying media, a title, a description, and actions side by side.

```
npx zard-cli@latest add item
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-preview',
  imports: [ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-content>
          <z-item-title>Basic Item</z-item-title>
          <z-item-description>A simple item with title and description.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Action</button>
        </z-item-actions>
      </z-item>

      <a z-item href="#" zVariant="outline" zSize="sm">
        <z-item-media>
          <ng-icon name="lucideBadgeCheck" size="1.25rem" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Your profile has been verified.</z-item-title>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideChevronRight" size="1rem" />
        </z-item-actions>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
})
export class ZardDemoItemPreviewComponent {}
```

### [Textarea](/docs/components/textarea)

Multi-line text input with the same variants, sizes, and validation states as the single-line input.

```
npx zard-cli@latest add textarea
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-preview',
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea id="textarea-preview" placeholder="Type your message here." class="w-72"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaPreviewComponent {}
```

### [Sonner](/docs/components/sonner)

An opinionated toast component with stacking, positioning, and per-type styling. Replaces the old toast.

```
npx zard-cli@latest add sonner
```

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-sonner-preview',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">Show Toast</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerPreviewComponent {
  private readonly sonner = inject(ZardSonnerService);

  show() {
    this.sonner.show('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}
```
