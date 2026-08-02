---
title: Alert
description: Displays a callout for user attention.
---

# Alert

Displays a callout for user attention.

## Installation

### CLI

```bash
npx zard-cli@latest add alert
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  alertActionVariants,
  alertDescriptionVariants,
  alertIconVariants,
  alertTitleVariants,
  alertVariants,
  type ZardAlertTypeVariants,
} from './alert.variants';

@Component({
  selector: 'z-alert, [z-alert]',
  imports: [NgIcon, ZardStringTemplateOutletDirective],
  template: `
    @if (zIcon() || iconName()) {
      <span [class]="iconClasses()" data-slot="alert-icon">
        <ng-container *zStringTemplateOutlet="zIcon()">
          <ng-icon [name]="iconName()" class="size-4!" />
        </ng-container>
      </span>
    }

    <div class="flex-1">
      @if (zTitle()) {
        <div [class]="titleClasses()" data-slot="alert-title">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>
      }

      @if (zDescription()) {
        <div data-slot="alert-description" [class]="descriptionClasses()">
          <ng-container *zStringTemplateOutlet="zDescription()">{{ zDescription() }}</ng-container>
        </div>
      }

      @if (zAction()) {
        <div data-slot="alert-action" [class]="actionClasses()">
          <ng-container *zStringTemplateOutlet="zAction()" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCircleAlert })],
  host: {
    '[attr.role]': 'role()',
    '[class]': 'classes()',
    'data-slot': 'alert',
  },
  exportAs: 'zAlert',
})
export class ZardAlertComponent {
  readonly class = input<ClassValue>('');
  readonly zAction = input<TemplateRef<void>>();
  readonly zDescription = input<string | TemplateRef<void>>('');
  readonly zIcon = input<TemplateRef<void> | string>();
  readonly zRole = input<'alert' | 'status'>();
  readonly zTitle = input<string | TemplateRef<void>>('');
  readonly zType = input<ZardAlertTypeVariants>('default');

  protected readonly actionClasses = computed(() => alertActionVariants());
  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType() }), this.class()));
  protected readonly descriptionClasses = computed(() => alertDescriptionVariants({ zType: this.zType() }));
  protected readonly iconClasses = computed(() => alertIconVariants());
  protected readonly role = computed(() => this.zRole() ?? (this.zAction() ? 'status' : 'alert'));
  protected readonly titleClasses = computed(() => alertTitleVariants());

  protected readonly iconName = computed((): string | undefined => {
    const customIcon = this.zIcon();
    if (customIcon && !(customIcon instanceof TemplateRef)) {
      return customIcon;
    }

    if (this.zType() === 'destructive') {
      return 'lucideCircleAlert';
    }

    return undefined;
  });
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot='alert-action']:pr-18 has-data-[slot='alert-icon']:grid-cols-[auto_1fr] has-data-[slot='alert-icon']:gap-x-2 **:data-[slot='alert-icon']:row-span-2 **:data-[slot='alert-icon']:translate-y-0.5 **:data-[slot='alert-icon']:text-current [&_[data-slot='alert-icon']_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      zType: {
        default: 'bg-card text-card-foreground',
        destructive:
          "bg-card text-destructive **:data-[slot='alert-description']:text-destructive/90 [&_[data-slot='alert-icon']_svg]:text-current",
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export const alertIconVariants = cva('shrink-0 self-start text-base!');

export const alertActionVariants = cva('absolute top-2 right-2');

export const alertTitleVariants = cva(
  "font-medium group-has-data-[slot='alert-icon']/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
);

export const alertDescriptionVariants = cva(
  'text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
  {
    variants: {
      zType: {
        default: 'text-muted-foreground',
        destructive: '',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardAlertTypeVariants = NonNullable<VariantProps<typeof alertVariants>['zType']>;
```

```angular-ts
export * from './alert.component';
export * from './alert.variants';
```

## Usage

```angular-ts
import { ZardAlertComponent } from '@/shared/components/alert/alert.component';
```

```angular-html
<z-alert zTitle="Heads up!" zDescription="You can add components to your app using the cli."></z-alert>
```

## Examples

### Basic

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';

import { ZardAlertComponent } from '../alert.component';

@Component({
  selector: 'z-demo-alert-basic',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zIcon="lucideCircleCheck"
        zTitle="Payment successful"
        zDescription="Your payment of $29.99 has been processed. A receipt has been sent to your email address."
      />

      <z-alert
        zIcon="lucideInfo"
        zTitle="New feature available"
        zDescription="We've added dark mode support. You can enable it in your account settings."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo })],
})
export class ZardDemoAlertBasicComponent {}
```

### Destructive

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-alert-destructive',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zType="destructive"
        zTitle="Payment failed"
        zDescription="Your payment could not be processed. Please check your payment method and try again."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDestructiveComponent {}
```

### Action

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'z-demo-alert-action',
  imports: [ZardAlertComponent, ZardButtonComponent],
  template: `
    <ng-template #actionTpl>
      <button type="button" z-button zSize="xs">Enable</button>
    </ng-template>

    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        class="w-md"
        zTitle="Dark mode is now available"
        zDescription="Enable it under your profile settings to get started."
        [zAction]="actionTpl"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertActionComponent {}
```

### Custom Colors

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-alert-custom-color',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
        zDescription="Renew now to avoid service interruption or upgrade to a paid plan to continue using the service."
        zIcon="lucideAlertTriangle"
        zTitle="Your subscription will expire in 3 days"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideAlertTriangle })],
})
export class ZardDemoAlertCustomColorsComponent {}
```

## API Reference

### z-alert

Displays a callout for user attention.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zAction]` | Alert action | `TemplateRef<void>` | `-` |
| `[zDescription]` | Alert description | `string \| TemplateRef<void>` | `-` |
| `[zIcon]` | Alert icon. If not specified, default icon will be lucideCircleAlert | `TemplateRef<void> \| string` | `-` |
| `[zRole]` | Overrides the ARIA role. Defaults to 'status' when [zAction] is set, otherwise 'alert'. | `'alert' \| 'status'` | `-` |
| `[zTitle]` | Alert title | `string \| TemplateRef<void>` | `-` |
| `[zType]` | Alert variant | `'default' \| 'destructive'` | `'default'` |

---

[Open in browser](https://zardui.com/docs/components/alert)
