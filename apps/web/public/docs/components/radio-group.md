---
title: Radio Group
description: A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
---

# Radio Group

A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.

## Installation

### CLI

```bash
npx zard-cli@latest add radio-group
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

import { radioGroupVariants, radioVariants } from './radio-group.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: unknown) => void;

@Component({
  selector: 'z-radio-group, [z-radio-group]',
  template: '<ng-content />',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardRadioGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'radiogroup',
    'data-slot': 'radio-group',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[class]': 'classes()',
  },
  exportAs: 'zRadioGroup',
})
export class ZardRadioGroupComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly value = model<unknown>(null);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>('');

  protected readonly formDisabled = signal(false);
  protected readonly classes = computed(() => mergeClasses(radioGroupVariants(), this.class()));
  readonly isDisabled = computed(() => this.zDisabled() || this.formDisabled());

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  select(value: unknown): void {
    if (this.isDisabled()) {
      return;
    }
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  isSelected(value: unknown): boolean {
    return this.value() === value;
  }

  writeValue(val: unknown): void {
    this.value.set(val);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}

@Component({
  selector: 'z-radio, [z-radio]',
  imports: [ZardIdDirective],
  template: `
    <button
      [id]="zId() || z.id()"
      type="button"
      role="radio"
      [attr.data-state]="checked() ? 'checked' : 'unchecked'"
      [attr.data-checked]="checked() ? '' : null"
      [attr.aria-checked]="checked()"
      [attr.aria-invalid]="zInvalid() ? 'true' : null"
      [class]="classes()"
      [disabled]="disabledState()"
      (click)="onSelect()"
      zardId="radio"
      #z="zardId"
    >
      @if (checked()) {
        <span data-slot="radio-group-indicator" class="flex size-4 items-center justify-center">
          <span class="bg-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full"></span>
        </span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zRadio',
})
export class ZardRadioComponent {
  private readonly group = inject(ZardRadioGroupComponent, { optional: true });

  readonly class = input<ClassValue>('');
  readonly value = input<unknown>(null);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zId = input<string>('');

  protected readonly checked = computed(() => this.group!.isSelected(this.value()));
  protected readonly disabledState = computed(() => this.zDisabled() || this.group!.isDisabled());
  protected readonly classes = computed(() => mergeClasses(radioVariants(), this.class()));

  constructor() {
    if (!this.group) {
      throw new Error('<z-radio> must be used inside a <z-radio-group>.');
    }
  }

  onSelect(): void {
    if (this.disabledState()) {
      return;
    }
    this.group!.select(this.value());
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const radioGroupVariants = cva('grid w-full gap-2');

export const radioVariants = cva(
  'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',
);
```

```angular-ts
export * from './radio-group.component';
export * from './radio-group.imports';
export * from './radio-group.variants';
```

```angular-ts
export { ZardRadioComponent, ZardRadioGroupComponent } from './radio-group.component';

import { ZardRadioComponent, ZardRadioGroupComponent } from './radio-group.component';

export const ZardRadioGroupImports = [ZardRadioGroupComponent, ZardRadioComponent] as const;
```

## Usage

```angular-ts
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';
```

```angular-html
<z-radio-group [(value)]="selected">
  <z-radio value="one" />
  <z-radio value="two" />
</z-radio-group>
```

## Examples

### Description

Radio group items with a description, composed from `z-field`, `z-field-content` and `z-field-description`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-description',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div z-field zOrientation="horizontal">
        <z-radio zId="desc-r1" value="default" />
        <div z-field-content>
          <label z-field-label for="desc-r1">Default</label>
          <p z-field-description>Standard spacing for most use cases.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="desc-r2" value="comfortable" />
        <div z-field-content>
          <label z-field-label for="desc-r2">Comfortable</label>
          <p z-field-description>More space between elements.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="desc-r3" value="compact" />
        <div z-field-content>
          <label z-field-label for="desc-r3">Compact</label>
          <p z-field-description>Minimal spacing for dense layouts.</p>
        </div>
      </div>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupDescriptionComponent {
  selected: unknown = 'comfortable';
}
```

### Choice Card

Wrap the whole `z-field` in a `label[z-field-label]` for a clickable card-style selection.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-choice-card',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group [(value)]="selected" class="min-w-sm">
      <label z-field-label for="plus-plan">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Plus</div>
            <p z-field-description>For individuals and small teams.</p>
          </div>
          <z-radio zId="plus-plan" value="plus" />
        </div>
      </label>
      <label z-field-label for="pro-plan">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Pro</div>
            <p z-field-description>For growing businesses.</p>
          </div>
          <z-radio zId="pro-plan" value="pro" />
        </div>
      </label>
      <label z-field-label for="enterprise-plan">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Enterprise</div>
            <p z-field-description>For large teams and enterprises.</p>
          </div>
          <z-radio zId="enterprise-plan" value="enterprise" />
        </div>
      </label>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupChoiceCardComponent {
  selected: unknown = 'plus';
}
```

### Fieldset

Use `fieldset[z-field-set]` and `legend[z-field-legend]` to group radio items with a label and description.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-fieldset',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <fieldset z-field-set class="w-full max-w-xs">
      <legend z-field-legend zVariant="label">Subscription Plan</legend>
      <p z-field-description>Yearly and lifetime plans offer significant savings.</p>
      <z-radio-group [(value)]="plan">
        <div z-field zOrientation="horizontal">
          <z-radio zId="plan-monthly" value="monthly" />
          <label z-field-label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-radio zId="plan-yearly" value="yearly" />
          <label z-field-label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-radio zId="plan-lifetime" value="lifetime" />
          <label z-field-label for="plan-lifetime" class="font-normal">Lifetime ($299.99)</label>
        </div>
      </z-radio-group>
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupFieldsetComponent {
  plan: unknown = 'monthly';
}
```

### Disabled

Set `zDisabled` on a single `z-radio` to disable that item; `data-disabled` on `z-field` drives the disabled styles.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-disabled',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-radio zId="disabled-1" value="option1" zDisabled />
        <label z-field-label for="disabled-1" class="font-normal">Disabled</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="disabled-2" value="option2" />
        <label z-field-label for="disabled-2" class="font-normal">Option 2</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="disabled-3" value="option3" />
        <label z-field-label for="disabled-3" class="font-normal">Option 3</label>
      </div>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupDisabledComponent {
  selected: unknown = 'option2';
}
```

### Invalid

Set `zInvalid` on `z-radio` (which sets `aria-invalid`) and `data-invalid` on `z-field` to show validation errors.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-invalid',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <fieldset z-field-set class="w-full max-w-xs">
      <legend z-field-legend zVariant="label">Notification Preferences</legend>
      <p z-field-description>Choose how you want to receive notifications.</p>
      <z-radio-group [(value)]="selected">
        <div z-field zOrientation="horizontal" data-invalid="true">
          <z-radio zId="invalid-email" value="email" zInvalid />
          <label z-field-label for="invalid-email" class="font-normal">Email only</label>
        </div>
        <div z-field zOrientation="horizontal" data-invalid="true">
          <z-radio zId="invalid-sms" value="sms" zInvalid />
          <label z-field-label for="invalid-sms" class="font-normal">SMS only</label>
        </div>
        <div z-field zOrientation="horizontal" data-invalid="true">
          <z-radio zId="invalid-both" value="both" zInvalid />
          <label z-field-label for="invalid-both" class="font-normal">Both Email & SMS</label>
        </div>
      </z-radio-group>
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupInvalidComponent {
  selected: unknown = 'email';
}
```

### Reactive Forms

Bind `z-radio-group` with `formControlName`; the disabled state of a `FormControl` is respected out of the box.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-reactive-forms',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="w-64">
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Billing plan</legend>
          <z-radio-group formControlName="plan">
            <div z-field zOrientation="horizontal">
              <z-radio zId="reactive-plan-monthly" value="monthly" />
              <label z-field-label for="reactive-plan-monthly" class="font-normal">Monthly</label>
            </div>
            <div z-field zOrientation="horizontal">
              <z-radio zId="reactive-plan-yearly" value="yearly" />
              <label z-field-label for="reactive-plan-yearly" class="font-normal">Yearly</label>
            </div>
          </z-radio-group>
        </fieldset>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Add-ons (locked)</legend>
          <z-radio-group formControlName="addons">
            <div z-field zOrientation="horizontal" data-disabled="true">
              <z-radio zId="reactive-addons-none" value="none" />
              <label z-field-label for="reactive-addons-none" class="font-normal">None</label>
            </div>
            <div z-field zOrientation="horizontal" data-disabled="true">
              <z-radio zId="reactive-addons-priority" value="priority" />
              <label z-field-label for="reactive-addons-priority" class="font-normal">Priority support</label>
            </div>
          </z-radio-group>
        </fieldset>
        <p class="text-muted-foreground text-sm">Plan: {{ form.controls.plan.value }}</p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupReactiveFormsComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    plan: ['monthly'],
    addons: [{ value: 'none', disabled: true }],
  });
}
```

## API Reference

### z-radio-group

Wrapper that groups radio items and manages the selected value.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[value]` | Selected value, two-way bindable | `unknown` | `null` |
| `[(value)]` | Selected value (two-way binding) | `unknown` | `null` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zDisabled]` | Disables every item in the group | `boolean` | `false` |
| `[name]` | Optional name for native form submission | `string` | `''` |

### z-radio

Individual radio button. Must be a descendant of z-radio-group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[value]` | Item value, compared against the group value | `unknown` | `null` |
| `[zDisabled]` | Disables this item only | `boolean` | `false` |
| `[zInvalid]` | Invalid state (sets aria-invalid) | `boolean` | `false` |
| `[zId]` | Item id | `string` | `-` |

---

[Open in browser](https://zardui.com/docs/components/radio-group)
