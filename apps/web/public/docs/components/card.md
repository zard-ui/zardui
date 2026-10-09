---
title: Card
description: Displays a card with header, content, and footer.
---

# Card

Displays a card with header, content, and footer.

## Installation

### CLI

```bash
npx zard-cli@latest add card
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  cardActionVariants,
  cardContentVariants,
  cardDescriptionVariants,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
  type ZardCardSizeType,
} from './card.variants';

@Component({
  selector: 'z-card-title, [z-card-title]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let title = zTitle();
    <ng-container *zStringTemplateOutlet="title">{{ title }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-title',
    '[class]': 'classes()',
  },
  exportAs: 'zCardTitle',
})
export class ZardCardTitleComponent {
  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly classes = computed(() => mergeClasses(cardTitleVariants(), this.class()));
}

@Component({
  selector: 'z-card-description, [z-card-description]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let description = zDescription();
    <ng-container *zStringTemplateOutlet="description">{{ description }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-description',
    '[class]': 'classes()',
  },
  exportAs: 'zCardDescription',
})
export class ZardCardDescriptionComponent {
  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly classes = computed(() => mergeClasses(cardDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-card-action, [z-card-action]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-action',
    '[class]': 'classes()',
  },
  exportAs: 'zCardAction',
})
export class ZardCardActionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardActionVariants(), this.class()));
}

@Component({
  selector: 'z-card-header, [z-card-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-header',
    '[class]': 'classes()',
  },
  exportAs: 'zCardHeader',
})
export class ZardCardHeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zHeaderBorder = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(cardHeaderVariants(), this.zHeaderBorder() ? 'border-b' : '', this.class()),
  );
}

@Component({
  selector: 'z-card-content, [z-card-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-content',
    '[class]': 'classes()',
  },
  exportAs: 'zCardContent',
})
export class ZardCardContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardContentVariants(), this.class()));
}

@Component({
  selector: 'z-card-footer, [z-card-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zCardFooter',
})
export class ZardCardFooterComponent {
  readonly class = input<ClassValue>('');
  readonly zFooterBorder = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(cardFooterVariants(), this.zFooterBorder() ? 'border-t' : '', this.class()),
  );
}

@Component({
  selector: 'z-card, [z-card]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zCard',
})
export class ZardCardComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardCardSizeType>('default');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
  {
    variants: {
      zSize: {
        default: '',
        sm: '',
      },
    },
  },
);

export type ZardCardSizeType = NonNullable<VariantProps<typeof cardVariants>['zSize']>;

export const cardHeaderVariants = cva(
  'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [&.border-b]:pb-(--card-spacing)',
);

export const cardTitleVariants = cva('text-base/snug font-medium group-data-[size=sm]/card:text-sm');

export const cardDescriptionVariants = cva('text-sm text-muted-foreground');

export const cardActionVariants = cva('col-start-2 row-span-2 row-start-1 self-start justify-self-end');

export const cardContentVariants = cva('px-(--card-spacing)');

export const cardFooterVariants = cva('flex items-center rounded-b-xl bg-muted/50 p-(--card-spacing)');
```

```angular-ts
import {
  ZardCardActionComponent,
  ZardCardComponent,
  ZardCardContentComponent,
  ZardCardDescriptionComponent,
  ZardCardFooterComponent,
  ZardCardHeaderComponent,
  ZardCardTitleComponent,
} from '@/shared/components/card/card.component';

export const ZardCardImports = [
  ZardCardComponent,
  ZardCardHeaderComponent,
  ZardCardTitleComponent,
  ZardCardDescriptionComponent,
  ZardCardActionComponent,
  ZardCardContentComponent,
  ZardCardFooterComponent,
] as const;
```

```angular-ts
export * from './card.component';
export * from './card.variants';
export * from './card.imports';
```

## Usage

```angular-ts
import { ZardCardComponent } from '@/shared/components/card/card.component';
```

```angular-html
<z-card zTitle="Card Title" zDescription="Card Description">
  <p>Card Content</p>
</z-card>
```

## Examples

### Size

Set `zSize="sm"` to switch the card to its compact gap and padding scale.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-size',
  imports: [ZardCardImports, ZardButtonComponent, NgIcon],
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-xs">
      <z-card-header>
        <z-card-title [zTitle]="featureName" />
        <z-card-description zDescription="Weekly snapshots. No more manual exports." />
      </z-card-header>
      <z-card-content>
        <ul class="grid gap-2 py-2 text-sm">
          <li class="flex gap-2">
            <ng-icon name="lucideChevronRight" class="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>Choose a schedule (daily, or weekly).</span>
          </li>
          <li class="flex gap-2">
            <ng-icon name="lucideChevronRight" class="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>Send to channels or specific teammates.</span>
          </li>
          <li class="flex gap-2">
            <ng-icon name="lucideChevronRight" class="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>Include charts, tables, and key metrics.</span>
          </li>
        </ul>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button zSize="sm" class="w-full">Set up scheduled reports</z-button>
        <z-button zType="outline" zSize="sm" class="w-full">See what's new</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class ZardDemoCardSizeComponent {
  readonly featureName = 'Scheduled reports';
}
```

### Spacing

Every gap and padding of the card reads the `--card-spacing` CSS variable. Override it on the root with a class such as `[--card-spacing:--spacing(6)]` to widen or tighten the whole card at once.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

const SPACING_OPTIONS = [
  { className: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
  { className: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
  { className: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
  { className: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' },
];

@Component({
  selector: 'z-demo-card-spacing',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent, ZardToggleGroupComponent],
  template: `
    <div class="mx-auto grid w-full min-w-sm gap-4">
      <z-toggle-group
        zMode="single"
        zType="outline"
        zSize="sm"
        class="justify-center"
        [zItems]="items"
        [zValue]="spacing()"
        (valueChange)="onSpacingChange($event)"
      />
      <z-card [class]="selectedSpacing()">
        <z-card-header>
          <z-card-title zTitle="Login to your account" />
          <z-card-description zDescription="Enter your email below to login to your account" />
          <z-card-action>
            <a z-button zType="link" href="#">Sign Up</a>
          </z-card-action>
        </z-card-header>
        <z-card-content>
          <div z-field-group>
            <div z-field>
              <label z-field-label for="card-spacing-email">Email</label>
              <input z-input id="card-spacing-email" type="email" placeholder="m@example.com" required />
            </div>
            <div z-field>
              <div class="flex items-center">
                <label z-field-label for="card-spacing-password">Password</label>
                <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
              </div>
              <input z-input id="card-spacing-password" type="password" required />
            </div>
          </div>
        </z-card-content>
        <z-card-footer class="flex-col gap-2">
          <z-button class="w-full">Login</z-button>
          <z-button zType="outline" class="w-full">Login with Google</z-button>
        </z-card-footer>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardSpacingComponent {
  readonly items: ZardToggleGroupItem[] = SPACING_OPTIONS.map(({ value, label }) => ({ value, label }));

  readonly spacing = signal('4');

  readonly selectedSpacing = computed(() => SPACING_OPTIONS.find(option => option.value === this.spacing())?.className);

  onSpacingChange(value: string | string[]) {
    const next = Array.isArray(value) ? value[0] : value;
    if (next) {
      this.spacing.set(next);
    }
  }
}
```

### Terms Of Service

A card with a scrollable content section and two footer actions, composed from z-card-content and a zFooterBorder-divided z-card-footer.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-terms-of-service',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <z-card class="mx-auto w-full max-w-sm">
      <z-card-header>
        <z-card-title zTitle="Terms of Service" />
        <z-card-description zDescription="Review the terms before accepting the agreement." />
      </z-card-header>
      <z-card-content class="-mb-4">
        <div class="bg-muted/50 -mx-4 max-h-48 space-y-4 overflow-y-auto border-t p-4 text-sm/relaxed">
          <p>
            These terms govern your use of the workspace, including access to shared documents, project files, and
            collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring that your team has the appropriate
            permissions to view or edit it.
          </p>
          <p>
            We may update features or limits as the service evolves. When those changes materially affect your workflow,
            we will notify your workspace administrators.
          </p>
          <p>
            By continuing, you agree to keep your account credentials secure and to follow your organization's
            acceptable use policies.
          </p>
        </div>
      </z-card-content>
      <z-card-footer zFooterBorder class="justify-end gap-2">
        <z-button zType="outline">Decline</z-button>
        <z-button>Accept</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardTermsOfServiceComponent {}
```

### Image

Add an image before the card header to create a card with an image.

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-image',
  imports: [ZardCardImports, ZardButtonComponent, ZardBadgeComponent, NgOptimizedImage],
  template: `
    <z-card class="relative mx-auto w-full min-w-sm pt-0">
      <div class="absolute inset-0 z-30 aspect-video bg-black/35"></div>
      <img
        ngSrc="https://avatar.vercel.sh/zardui"
        alt="Event cover"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        width="640"
        height="360"
      />
      <z-card-header>
        <z-card-action>
          <z-badge zType="secondary">Featured</z-badge>
        </z-card-action>
        <z-card-title zTitle="Design systems meetup" />
        <z-card-description
          zDescription="A practical talk on component APIs, accessibility, and shipping
          faster."
        />
      </z-card-header>
      <z-card-footer>
        <z-button class="w-full">View Event</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardImageComponent {}
```

## API Reference

### z-card, [z-card]

A structured container for displaying content with optional header and footer sections.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zSize]` | Size variant of the card. `sm` sets `--card-spacing` to `--spacing(3)` and shrinks the title | `'default' \| 'sm'` | `'default'` |
| `[--card-spacing]` | CSS variable behind every gap and padding of the card and its sections, e.g. `class="[--card-spacing:--spacing(6)]"` | `length` | `--spacing(4)` |

### z-card-header, [z-card-header]

Container for card title, description, and optional action.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zHeaderBorder]` | Adds a bottom border to the header | `boolean` | `false` |

### z-card-title, [z-card-title]

Card title text or template.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zTitle]` | Title content — string or template reference | `string \| TemplateRef<void> \| undefined` | `-` |

### z-card-description, [z-card-description]

Card description text or template.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zDescription]` | Description content — string or template reference | `string \| TemplateRef<void> \| undefined` | `-` |

### z-card-action, [z-card-action]

Action button displayed in the card header.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-card-content, [z-card-content]

Main content area of the card.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-card-footer, [z-card-footer]

Footer section of the card.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zFooterBorder]` | Adds a top border to the footer | `boolean` | `false` |

---

[Open in browser](https://zardui.com/docs/components/card)
