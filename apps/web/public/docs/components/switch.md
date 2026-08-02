---
title: Switch
description: A control that allows the user to toggle between checked and unchecked.
---

# Switch

A control that allows the user to toggle between checked and unchecked.

## Installation

### CLI

```bash
npx zard-cli@latest add switch
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { switchVariants, type ZardSwitchSizeVariants } from './switch.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-switch',
  imports: [ZardIdDirective],
  template: `
    <span class="flex items-center space-x-2" zardId="switch" #z="zardId" [attr.data-checked]="zChecked() ? '' : null">
      <button
        [id]="zId() || z.id()"
        type="button"
        role="switch"
        [attr.data-state]="status()"
        [attr.aria-checked]="zChecked()"
        [attr.aria-invalid]="zInvalid() ? 'true' : null"
        [class]="classes()"
        [disabled]="zDisabled() || formDisabled()"
        (click)="onSwitchChange()"
      >
        <span
          [attr.data-size]="zSize()"
          [attr.data-state]="status()"
          class="bg-background dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[size=default]:size-4 data-[size=sm]:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        ></span>
      </button>

      <label
        class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        [for]="zId() || z.id()"
      >
        <ng-content><span class="sr-only">toggle switch</span></ng-content>
      </label>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSwitch',
})
export class ZardSwitchComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly zChecked = model<boolean>(false);
  readonly zId = input<string>('');
  readonly zSize = input<ZardSwitchSizeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  protected readonly status = computed(() => (this.zChecked() ? 'checked' : 'unchecked'));
  protected readonly classes = computed(() => mergeClasses(switchVariants({ zSize: this.zSize() }), this.class()));

  protected readonly formDisabled = signal(false);

  writeValue(val: boolean): void {
    this.zChecked.set(val);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onSwitchChange(): void {
    if (this.zDisabled() || this.formDisabled()) {
      return;
    }

    this.zChecked.update(checked => !checked);
    this.onTouched();
    this.onChange(this.zChecked());
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
  'peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zSize: {
        default: 'h-[18.4px] w-[32px]',
        sm: 'h-[14px] w-[24px]',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardSwitchSizeVariants = NonNullable<VariantProps<typeof switchVariants>['zSize']>;
```

```angular-ts
export * from './switch.component';
export * from './switch.variants';
```

## Usage

```angular-ts
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';
```

```angular-html
<z-switch></z-switch>
```

## Examples

### Description

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-description',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" class="max-w-sm">
      <div z-field-content>
        <label z-field-label for="switch-focus-mode">Share across devices</label>
        <p z-field-description>Focus is shared across devices, and turns off when you leave the app.</p>
      </div>
      <z-switch zId="switch-focus-mode" />
    </div>
  `,
})
export class ZardDemoSwitchDescriptionComponent {}
```

### Choice Card

Card-style selection where `FieldLabel` wraps the entire `Field` for a clickable card pattern.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-choice-card',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field-group class="w-full min-w-sm">
      <label z-field-label for="switch-share">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Share across devices</div>
            <p z-field-description>Focus is shared across devices, and turns off when you leave the app.</p>
          </div>
          <z-switch zId="switch-share" />
        </div>
      </label>
      <label z-field-label for="switch-notifications">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>Receive notifications when focus mode is enabled or disabled.</p>
          </div>
          <z-switch zId="switch-notifications" [zChecked]="true" />
        </div>
      </label>
    </div>
  `,
})
export class ZardDemoSwitchChoiceCardComponent {}
```

### Disabled

Add the `zDisabled` prop to the `Switch` component to disable the switch. Add the `data-disabled` prop to the `Field` component for styling.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-disabled',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" data-disabled="true" class="w-fit">
      <z-switch zId="switch-disabled-unchecked" zDisabled />
      <label z-field-label for="switch-disabled-unchecked">Disabled</label>
    </div>
  `,
})
export class ZardDemoSwitchDisabledComponent {}
```

### Invalid

Add the `zInvalid` prop to the `Switch` component to indicate an invalid state. Add the `data-invalid` prop to the `Field` component for styling.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-invalid',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" data-invalid="true" class="max-w-sm">
      <div z-field-content>
        <label z-field-label for="switch-terms">Accept terms and conditions</label>
        <p z-field-description>You must accept the terms and conditions to continue.</p>
      </div>
      <z-switch zId="switch-terms" zInvalid />
    </div>
  `,
})
export class ZardDemoSwitchInvalidComponent {}
```

### Size

Use the `zSize` prop to change the size of the switch.

```angular-ts
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-size',
  imports: [ZardSwitchComponent],
  template: `
    <div class="grid w-full min-w-sm items-center justify-center gap-6">
      <z-switch zSize="sm">Small</z-switch>
      <z-switch>Default</z-switch>
    </div>
  `,
})
export class ZardDemoSwitchSizeComponent {}
```

## API Reference

### [z-switch]

A customizable switch with minimal configuration.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[(zChecked)]` | Switch state (two-way binding) | `boolean` | `false` |
| `[zDisabled]` | Switch disabled state | `boolean` | `false` |
| `[zInvalid]` | Switch invalid state (sets aria-invalid) | `boolean` | `false` |
| `[zId]` | Switch id | `string` | `-` |
| `[zSize]` | Switch size | `'default' \| 'sm'` | `'default'` |

---

[Open in browser](https://zardui.com/docs/components/switch)
