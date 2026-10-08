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
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

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
          class="bg-background dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[size=default]:size-4 data-[size=sm]:size-3 data-[state=unchecked]:translate-x-0 ltr:data-[state=checked]:translate-x-[calc(100%-2px)] rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]"
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
  host: {
    'data-slot': 'switch',
  },
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

Pair `z-field-content` with `z-field-label` and `z-field-description` for helper text.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchDescriptionComponent {}
```

### Choice Card

Card-style selection where `label[z-field-label]` wraps the entire `z-field` for a clickable card pattern.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
          <z-switch zId="switch-share"><span class="sr-only">Share across devices</span></z-switch>
        </div>
      </label>
      <label z-field-label for="switch-notifications">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>Receive notifications when focus mode is enabled or disabled.</p>
          </div>
          <z-switch zId="switch-notifications" [zChecked]="true">
            <span class="sr-only">Enable notifications</span>
          </z-switch>
        </div>
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchChoiceCardComponent {}
```

### Disabled

Use `zDisabled` to disable the switch, and add `data-disabled` to `z-field` for the matching wrapper styles.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchDisabledComponent {}
```

### Invalid

Use `zInvalid` to mark the switch as invalid (sets `aria-invalid`), and add `data-invalid` to `z-field` for the matching wrapper styles.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchInvalidComponent {}
```

### Size

Use `zSize` to change the size of the switch (`default` or `sm`).

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-size',
  imports: [ZardSwitchComponent],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <div class="flex items-center gap-6">
        <z-switch zSize="sm">Small</z-switch>
        <z-switch zSize="sm" [zChecked]="true">Small (checked)</z-switch>
      </div>
      <div class="flex items-center gap-6">
        <z-switch>Default</z-switch>
        <z-switch [zChecked]="true">Default (checked)</z-switch>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchSizeComponent {}
```

### Controlled

Drive the switch from outside with a one-way `[zChecked]` binding and the `(zCheckedChange)` output, instead of the two-way `[(zChecked)]` binding.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-controlled',
  imports: [ZardSwitchComponent, ZardButtonComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="mx-auto w-64">
      <div z-field zOrientation="horizontal">
        <z-switch
          zId="notifications-controlled"
          [zChecked]="notifications()"
          (zCheckedChange)="notifications.set($event)"
        />
        <label z-field-label for="notifications-controlled">Enable notifications</label>
      </div>
      <p class="text-muted-foreground text-sm">Notifications are {{ notifications() ? 'on' : 'off' }}.</p>
      <button type="button" z-button zType="outline" zSize="sm" (click)="notifications.set(!notifications())">
        Toggle from outside
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchControlledComponent {
  protected readonly notifications = signal(true);
}
```

### Reactive Forms

Bind `z-switch` with `formControlName`; a control created with `disabled: true` renders the switch disabled and keeps it in sync.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-reactive-forms',
  imports: [ZardSwitchComponent, ...ZardFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="mx-auto w-64">
        <div z-field zOrientation="horizontal">
          <z-switch zId="newsletter-switch" formControlName="newsletter" />
          <label z-field-label for="newsletter-switch">Subscribe to newsletter</label>
        </div>
        <div z-field zOrientation="horizontal" data-disabled="true">
          <z-switch zId="beta-switch" formControlName="betaFeatures" />
          <label z-field-label for="beta-switch">Beta features (locked)</label>
        </div>
        <p class="text-muted-foreground text-sm">
          Newsletter: {{ form.controls.newsletter.value ? 'subscribed' : 'not subscribed' }}
        </p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchReactiveFormsComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    newsletter: [true],
    betaFeatures: [{ value: false, disabled: true }],
  });
}
```

## API Reference

### z-switch

A control that toggles between checked and unchecked, built on a native button with role="switch".

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zChecked]` | Checked state, two-way bindable | `boolean` | `false` |
| `[(zChecked)]` | Checked state (two-way binding) | `boolean` | `false` |
| `[zId]` | Id applied to the underlying button | `string` | `-` |
| `[zSize]` | Switch size | `'default' \| 'sm'` | `'default'` |
| `[zDisabled]` | Disables the switch | `boolean` | `false` |
| `[zInvalid]` | Invalid state (sets aria-invalid) | `boolean` | `false` |

---

[Open in browser](https://zardui.com/docs/components/switch)
