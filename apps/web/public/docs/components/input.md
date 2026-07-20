---
title: Input
description: Displays a form input field or a component that looks like an input field.
---

# Input

Displays a form input field or a component that looks like an input field.

## Installation

### CLI

```bash
npx zard-cli@latest add input
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { inputGroupInputVariants, inputVariants } from './input.variants';

type OnTouchedType = () => void;
type ZardInputElement = HTMLInputElement | HTMLTextAreaElement;
type ZardInputValue = string | number | null | undefined;
type OnChangeType = (value: ZardInputValue) => void;

@Component({
  selector: 'input[z-input]',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': 'parentGroup ? "input-group-control" : "input"',
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
    '(blur)': 'onBlur()',
  },
  exportAs: 'zInput',
})
export class ZardInputComponent implements ControlValueAccessor {
  readonly parentGroup = inject(ZardInputGroupComponent, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  private onTouchedFn: OnTouchedType = noopFn;
  private onChangeFn: OnChangeType = noopFn;

  readonly class = input<ClassValue>('');
  readonly value = model<ZardInputValue>(null);

  protected readonly classes = computed(() =>
    mergeClasses(inputVariants(), this.parentGroup ? inputGroupInputVariants() : '', this.class()),
  );

  constructor() {
    effect(() => {
      this.writeNativeValue(this.value());
      const value = this.value();
      if (value !== undefined && value !== null) {
        this.elementRef.nativeElement.value = value;
      }
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as ZardInputElement | null;
    this.value.set(this.readNativeValue(el));
    this.onChangeFn(this.value());
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  writeValue(value?: string): void {
    this.value.set(value ?? '');
  }

  private isNumericInput(element: ZardInputElement): element is HTMLInputElement {
    return element.tagName.toLowerCase() === 'input' && ['number', 'range'].includes(element.type);
  }

  private readNativeValue(element: ZardInputElement | null): ZardInputValue {
    if (!element) {
      return '';
    }

    if (this.isNumericInput(element)) {
      const currentValue = this.value();

      if (typeof currentValue === 'number' || currentValue === null) {
        if (element.value === '') {
          return null;
        }

        const numericValue = element.valueAsNumber;
        return Number.isNaN(numericValue) ? null : numericValue;
      }
    }

    return element.value;
  }

  private writeNativeValue(value: ZardInputValue): void {
    const element = this.elementRef.nativeElement;

    if (this.isNumericInput(element) && typeof value === 'number') {
      element.value = Number.isNaN(value) ? '' : String(value);
      return;
    }

    element.value = String(value ?? '');
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
);

export const inputGroupInputVariants = cva(
  'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
);
```

```angular-ts
export * from './input.component';
export * from './input.variants';
```

## Usage

```angular-ts
import { ZardInputComponent } from '@/shared/components/input/input.component';
```

```angular-html
<input z-input type="email" placeholder="Email" />
```

## Examples

### Basic

```angular-ts
import { Component } from '@angular/core';

import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-basic',
  imports: [ZardInputComponent],
  template: `
    <input z-input placeholder="Enter text" class="w-72" />
  `,
})
export class ZardDemoInputBasicComponent {}
```

### Field

Use `Field`, `FieldLabel`, and `FieldDescription` to create an input with a label and description.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-field',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-field-username">Username</label>
      <input z-input id="input-field-username" type="text" placeholder="Enter your username" />
      <p z-field-description>Choose a unique username for your account.</p>
    </div>
  `,
})
export class ZardDemoInputFieldComponent {}
```

### Field Group

Use `FieldGroup` to show multiple `Field` blocks and to build forms.

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-field-group',
  imports: [ZardInputComponent, ZardButtonComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="w-72">
      <div z-field>
        <label z-field-label for="fieldgroup-name">Name</label>
        <input z-input id="fieldgroup-name" placeholder="Jordan Lee" />
      </div>
      <div z-field>
        <label z-field-label for="fieldgroup-email">Email</label>
        <input z-input id="fieldgroup-email" type="email" placeholder="name@example.com" />
        <p z-field-description>We'll send updates to this address.</p>
      </div>
      <div z-field zOrientation="horizontal">
        <button z-button type="reset" zType="outline">Reset</button>
        <button z-button type="submit">Submit</button>
      </div>
    </div>
  `,
})
export class ZardDemoInputFieldGroupComponent {}
```

### Disabled

Use the `disabled` prop to disable the input. To style the disabled state, add the `data-disabled` attribute to the `Field` component.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-disabled',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-disabled="true">
      <label z-field-label for="input-demo-disabled">Email</label>
      <input z-input id="input-demo-disabled" type="email" placeholder="Email" disabled />
      <p z-field-description>This field is currently disabled.</p>
    </div>
  `,
})
export class ZardDemoInputDisabledComponent {}
```

### Invalid

Use the `aria-invalid` prop to mark the input as invalid. To style the invalid state, add the `data-invalid` attribute to the `Field` component.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-invalid',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-invalid="true">
      <label z-field-label for="input-invalid">Invalid Input</label>
      <input z-input id="input-invalid" placeholder="Error" aria-invalid="true" />
      <p z-field-description>This field contains validation errors.</p>
    </div>
  `,
})
export class ZardDemoInputInvalidComponent {}
```

### File

Use the `type="file"` prop to create a file input.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-file',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="picture">Picture</label>
      <input z-input id="picture" type="file" />
      <p z-field-description>Select a picture to upload.</p>
    </div>
  `,
})
export class ZardDemoInputFileComponent {}
```

### Inline

Use `Field` with `orientation="horizontal"` to create an inline input. Pair with `Button` to create a search input with a button.

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-inline',
  imports: [ZardInputComponent, ZardButtonComponent, ...ZardFieldImports],
  template: `
    <div z-field zOrientation="horizontal" class="w-80">
      <input z-input type="search" placeholder="Search..." />
      <button type="button" z-button>Search</button>
    </div>
  `,
})
export class ZardDemoInputInlineComponent {}
```

### Grid

Use a grid layout to place multiple inputs side by side.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-grid',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="grid min-w-sm grid-cols-2">
      <div z-field>
        <label z-field-label for="first-name">First Name</label>
        <input z-input id="first-name" placeholder="Jordan" />
      </div>
      <div z-field>
        <label z-field-label for="last-name">Last Name</label>
        <input z-input id="last-name" placeholder="Lee" />
      </div>
    </div>
  `,
})
export class ZardDemoInputGridComponent {}
```

### Required

Use the `required` attribute to indicate required inputs.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-required',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-required">
        Required Field
        <span class="text-destructive">*</span>
      </label>
      <input z-input id="input-required" placeholder="This field is required" required />
      <p z-field-description>This field must be filled out.</p>
    </div>
  `,
})
export class ZardDemoInputRequiredComponent {}
```

### Badge

Use `Badge` in the label to highlight a recommended field.

```angular-ts
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-badge',
  imports: [ZardInputComponent, ZardBadgeComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-badge">
        Webhook URL
        <z-badge zType="secondary" class="ml-auto">Beta</z-badge>
      </label>
      <input z-input id="input-badge" type="url" placeholder="https://api.example.com/webhook" />
    </div>
  `,
})
export class ZardDemoInputBadgeComponent {}
```

### Input Group

To add icons, text, or buttons inside an input, use the `InputGroup` component. See the Input Group component for more examples.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-input-group',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-group-url">Website URL</label>
      <z-input-group>
        <z-input-group-addon>
          <span z-input-group-text>https://</span>
        </z-input-group-addon>
        <input z-input id="input-group-url" placeholder="example.com" />
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideInfo" />
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideInfo })],
})
export class ZardDemoInputInputGroupComponent {}
```

### Button Group

To add buttons to an input, use the `ButtonGroup` component. See the Button Group component for more examples.

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-button-group',
  imports: [ZardInputComponent, ZardButtonComponent, ZardButtonGroupComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-button-group">Search</label>
      <z-button-group>
        <input z-input id="input-button-group" placeholder="Type to search..." />
        <button z-button zType="outline">Search</button>
      </z-button-group>
    </div>
  `,
})
export class ZardDemoInputButtonGroupComponent {}
```

### Form

A full form example with multiple inputs, a select, and a button.

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-input-form',
  imports: [ZardInputComponent, ZardButtonComponent, ZardSelectImports, ...ZardFieldImports],
  template: `
    <form class="w-full min-w-sm">
      <div z-field-group>
        <div z-field>
          <label z-field-label for="form-name">Name</label>
          <input z-input id="form-name" type="text" placeholder="Evil Rabbit" required />
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
            <label z-field-label for="form-country">Country</label>
            <z-select id="form-country" [(zValue)]="country">
              <z-select-item zValue="us">United States</z-select-item>
              <z-select-item zValue="uk">United Kingdom</z-select-item>
              <z-select-item zValue="ca">Canada</z-select-item>
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
  `,
})
export class ZardDemoInputFormComponent {
  country = 'us';
}
```

## API Reference

### z-input, input[z-input]

A form input field. Usable as a component or as a directive on a native input. All native HTML input attributes (placeholder, name, disabled, readonly, aria-invalid, etc.) are supported on the directive form.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[(value)]` | Input value (two-way binding) | `string` | `''` |
| `[zType]` | Native input type (z-input only) | `string` | `'text'` |

---

[Open in browser](https://zardui.com/docs/components/input)
