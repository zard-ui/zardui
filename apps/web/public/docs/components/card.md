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
  cardDescriptionVariant,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariant,
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

  protected readonly classes = computed(() => mergeClasses(cardTitleVariant(), this.class()));
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

  protected readonly classes = computed(() => mergeClasses(cardDescriptionVariant(), this.class()));
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
  'group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
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
  'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [&.border-b]:pb-4 group-data-[size=sm]/card:[&.border-b]:pb-3',
);

export const cardTitleVariant = cva('text-base/snug font-medium group-data-[size=sm]/card:text-sm');

export const cardDescriptionVariant = cva('text-sm text-muted-foreground');

export const cardActionVariants = cva('col-start-2 row-span-2 row-start-1 self-start justify-self-end');

export const cardContentVariants = cva('px-4 group-data-[size=sm]/card:px-3');

export const cardFooterVariants = cva('flex items-center rounded-b-xl bg-muted/50 p-4 group-data-[size=sm]/card:p-3');
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

Use the zSize="sm" input to set the size of the card to small. The small size variant uses smaller spacing.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-small',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-sm">
      <z-card-header>
        <z-card-title zTitle="Small Card" />
        <z-card-description zDescription="This card uses the small size variant." />
      </z-card-header>
      <z-card-content>
        <p>
          The card component supports a zSize input that can be set to &quot;sm&quot; for a more compact appearance.
        </p>
      </z-card-content>
      <z-card-footer>
        <z-button zType="outline" zSize="sm" class="w-full">Action</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardSmallComponent {}
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
        ngSrc="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        width="120"
        height="120"
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
| `[zSize]` | Size variant of the card | `'default' \| 'sm'` | `'default'` |

### z-card-header, [z-card-header]

Container for card title, description, and optional action.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
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
