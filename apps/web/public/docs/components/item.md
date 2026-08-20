---
title: Item
description: A versatile component for displaying content with media, title, description, and actions.
---

# Item

A versatile component for displaying content with media, title, description, and actions.

## Installation

### CLI

```bash
npx zard-cli@latest add item
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  itemActionsVariants,
  itemContentVariants,
  itemDescriptionVariants,
  itemFooterVariants,
  itemGroupVariants,
  itemHeaderVariants,
  itemMediaVariants,
  itemSeparatorVariants,
  itemTitleVariants,
  itemVariants,
  type ZardItemMediaVariantVariants,
  type ZardItemSizeVariants,
  type ZardItemVariantVariants,
} from './item.variants';

@Component({
  selector: 'z-item-group, [z-item-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'list',
    'data-slot': 'item-group',
    '[class]': 'classes()',
  },
  exportAs: 'zItemGroup',
})
export class ZardItemGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemGroupVariants(), this.class()));
}

@Component({
  selector: 'z-item-separator, [z-item-separator]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
    'data-slot': 'item-separator',
    '[class]': 'classes()',
  },
  exportAs: 'zItemSeparator',
})
export class ZardItemSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemSeparatorVariants(), this.class()));
}

@Component({
  selector: 'z-item, [z-item]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item',
    '[attr.data-variant]': 'zVariant()',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zItem',
})
export class ZardItemComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardItemVariantVariants>('default');
  readonly zSize = input<ZardItemSizeVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(itemVariants({ zVariant: this.zVariant(), zSize: this.zSize() }), this.class()),
  );
}

@Component({
  selector: 'z-item-media, [z-item-media]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-media',
    '[attr.data-variant]': 'zVariant()',
    '[class]': 'classes()',
  },
  exportAs: 'zItemMedia',
})
export class ZardItemMediaComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardItemMediaVariantVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(itemMediaVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-item-content, [z-item-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-content',
    '[class]': 'classes()',
  },
  exportAs: 'zItemContent',
})
export class ZardItemContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemContentVariants(), this.class()));
}

@Component({
  selector: 'z-item-title, [z-item-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-title',
    '[class]': 'classes()',
  },
  exportAs: 'zItemTitle',
})
export class ZardItemTitleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemTitleVariants(), this.class()));
}

@Component({
  selector: 'z-item-description, p[z-item-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-description',
    '[class]': 'classes()',
  },
  exportAs: 'zItemDescription',
})
export class ZardItemDescriptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-item-actions, [z-item-actions]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-actions',
    '[class]': 'classes()',
  },
  exportAs: 'zItemActions',
})
export class ZardItemActionsComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemActionsVariants(), this.class()));
}

@Component({
  selector: 'z-item-header, [z-item-header]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-header',
    '[class]': 'classes()',
  },
  exportAs: 'zItemHeader',
})
export class ZardItemHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-item-footer, [z-item-footer]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zItemFooter',
})
export class ZardItemFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemFooterVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const itemGroupVariants = cva(
  'group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2',
);

export const itemSeparatorVariants = cva('bg-border my-2 block h-px w-full shrink-0');

export const itemVariants = cva(
  mergeClasses(
    'group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    '[a]:transition-colors [a]:hover:bg-muted',
  ),
  {
    variants: {
      zVariant: {
        default: 'border-transparent',
        outline: 'border-border',
        muted: 'border-transparent bg-muted/50',
      },
      zSize: {
        default: 'gap-2.5 px-3 py-2.5',
        sm: 'gap-2.5 px-3 py-2.5',
        xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0',
      },
    },
    defaultVariants: {
      zVariant: 'default',
      zSize: 'default',
    },
  },
);

export const itemMediaVariants = cva(
  mergeClasses(
    'flex shrink-0 items-center justify-center gap-2',
    'group-has-data-[slot=item-description]/item:translate-y-0.5',
    'group-has-data-[slot=item-description]/item:self-start',
    '[&_svg]:pointer-events-none',
  ),
  {
    variants: {
      zVariant: {
        default: 'bg-transparent',
        icon: "[--ng-icon__size:1rem] [&_svg:not([class*='size-'])]:size-4",
        image:
          'size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const itemContentVariants = cva(
  'flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none',
);

export const itemTitleVariants = cva(
  'line-clamp-1 flex w-fit items-center gap-2 text-sm font-medium leading-snug underline-offset-4',
);

export const itemDescriptionVariants = cva(
  mergeClasses(
    'line-clamp-2 text-left text-sm font-normal leading-normal text-muted-foreground',
    'group-data-[size=xs]/item:text-xs',
    '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
  ),
);

export const itemActionsVariants = cva('flex items-center gap-2');

export const itemHeaderVariants = cva('flex basis-full items-center justify-between gap-2');

export const itemFooterVariants = cva('flex basis-full items-center justify-between gap-2');

export type ZardItemVariantVariants = NonNullable<VariantProps<typeof itemVariants>['zVariant']>;
export type ZardItemSizeVariants = NonNullable<VariantProps<typeof itemVariants>['zSize']>;
export type ZardItemMediaVariantVariants = NonNullable<VariantProps<typeof itemMediaVariants>['zVariant']>;
```

```angular-ts
export * from './item.component';
export * from './item.imports';
export * from './item.variants';
```

```angular-ts
export {
  ZardItemActionsComponent,
  ZardItemComponent,
  ZardItemContentComponent,
  ZardItemDescriptionComponent,
  ZardItemFooterComponent,
  ZardItemGroupComponent,
  ZardItemHeaderComponent,
  ZardItemMediaComponent,
  ZardItemSeparatorComponent,
  ZardItemTitleComponent,
} from './item.component';

import {
  ZardItemActionsComponent,
  ZardItemComponent,
  ZardItemContentComponent,
  ZardItemDescriptionComponent,
  ZardItemFooterComponent,
  ZardItemGroupComponent,
  ZardItemHeaderComponent,
  ZardItemMediaComponent,
  ZardItemSeparatorComponent,
  ZardItemTitleComponent,
} from './item.component';

export const ZardItemImports = [
  ZardItemGroupComponent,
  ZardItemSeparatorComponent,
  ZardItemComponent,
  ZardItemMediaComponent,
  ZardItemContentComponent,
  ZardItemTitleComponent,
  ZardItemDescriptionComponent,
  ZardItemActionsComponent,
  ZardItemHeaderComponent,
  ZardItemFooterComponent,
] as const;
```

## Usage

```angular-ts
import { ZardItemImports } from '@/shared/components/item/item.imports';
```

```angular-html
<z-item zVariant="outline">
  <z-item-content>
    <z-item-title>Title</z-item-title>
    <z-item-description>Description</z-item-description>
  </z-item-content>
</z-item>
```

## Examples

### Default

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-default',
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
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
})
export class ZardDemoItemDefaultComponent {}
```

### Variant

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';

import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-variant',
  imports: [NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item>
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Default Variant</z-item-title>
          <z-item-description>Transparent background with no border.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Outline Variant</z-item-title>
          <z-item-description>Outlined style with a visible border.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="muted">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Muted Variant</z-item-title>
          <z-item-description>Muted background for secondary content.</z-item-description>
        </z-item-content>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucideInbox })],
})
export class ZardDemoItemVariantComponent {}
```

### Size

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';

import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-size',
  imports: [NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Default Size</z-item-title>
          <z-item-description>The standard size for most use cases.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="outline" zSize="sm">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Small Size</z-item-title>
          <z-item-description>A compact size for dense layouts.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="outline" zSize="xs">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Extra Small Size</z-item-title>
          <z-item-description>The most compact size available.</z-item-description>
        </z-item-content>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucideInbox })],
})
export class ZardDemoItemSizeComponent {}
```

### Icon

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldAlert } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-icon',
  imports: [ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-lg flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideShieldAlert" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Security Alert</z-item-title>
          <z-item-description>New login detected from unknown device.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Review</button>
        </z-item-actions>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucideShieldAlert })],
})
export class ZardDemoItemIconComponent {}
```

### Avatar

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent, ZardAvatarGroupComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-avatar',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-lg flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-media>
          <z-avatar zSrc="https://github.com/evilrabbit.png" zFallback="ER" class="size-10" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Evil Rabbit</z-item-title>
          <z-item-description>Last seen 5 months ago</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="icon-sm" zShape="circle" aria-label="Invite">
            <ng-icon name="lucidePlus" />
          </button>
        </z-item-actions>
      </z-item>

      <z-item zVariant="outline">
        <z-item-media>
          <z-avatar-group>
            <z-avatar zSrc="https://github.com/zard-ui.png" zAlt="@zardui" zFallback="ZU" class="grayscale" />
            <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" class="grayscale" />
            <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" class="grayscale" />
          </z-avatar-group>
        </z-item-media>
        <z-item-content>
          <z-item-title>No Team Members</z-item-title>
          <z-item-description>Invite your team to collaborate on this project.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Invite</button>
        </z-item-actions>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoItemAvatarComponent {}
```

### Image

```angular-ts
import { Component } from '@angular/core';

import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Song {
  title: string;
  artist: string;
  album: string;
  duration: string;
}

@Component({
  selector: 'z-demo-item-image',
  imports: [...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item-group class="gap-4">
        @for (song of music; track song.title) {
          <a z-item href="#" zVariant="outline" role="listitem">
            <z-item-media zVariant="image">
              <img [src]="'https://avatar.vercel.sh/' + song.title" [alt]="song.title" class="object-cover grayscale" />
            </z-item-media>
            <z-item-content>
              <z-item-title class="line-clamp-1">
                {{ song.title }} -
                <span class="text-muted-foreground">{{ song.album }}</span>
              </z-item-title>
              <z-item-description>{{ song.artist }}</z-item-description>
            </z-item-content>
            <z-item-content class="flex-none text-center">
              <z-item-description>{{ song.duration }}</z-item-description>
            </z-item-content>
          </a>
        }
      </z-item-group>
    </div>
  `,
})
export class ZardDemoItemImageComponent {
  protected readonly music: Song[] = [
    { title: 'Midnight City Lights', artist: 'Neon Dreams', album: 'Electric Nights', duration: '3:45' },
    { title: 'Coffee Shop Conversations', artist: 'The Morning Brew', album: 'Urban Stories', duration: '4:05' },
    { title: 'Digital Rain', artist: 'Cyber Symphony', album: 'Binary Beats', duration: '3:30' },
  ];
}
```

### Group

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Person {
  username: string;
  avatar: string;
  email: string;
}

@Component({
  selector: 'z-demo-item-group',
  imports: [ZardAvatarComponent, ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <z-item-group class="min-w-sm">
      @for (person of people; track person.username) {
        <z-item zVariant="outline">
          <z-item-media>
            <z-avatar [zSrc]="person.avatar" [zFallback]="person.username.charAt(0).toUpperCase()" class="grayscale" />
          </z-item-media>
          <z-item-content class="gap-1">
            <z-item-title>{{ person.username }}</z-item-title>
            <z-item-description>{{ person.email }}</z-item-description>
          </z-item-content>
          <z-item-actions>
            <button type="button" z-button zType="ghost" zSize="icon-sm" zShape="circle">
              <ng-icon name="lucidePlus" />
            </button>
          </z-item-actions>
        </z-item>
      }
    </z-item-group>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoItemGroupComponent {
  protected readonly people: Person[] = [
    { username: 'zardui', avatar: 'https://github.com/zard-ui.png', email: 'zardui@example.com' },
    { username: 'srizzon', avatar: 'https://github.com/srizzon.png', email: 'srizzon@example.com' },
    { username: 'luizgomess', avatar: 'https://github.com/Luizgomess.png', email: 'luizgomess@example.com' },
  ];
}
```

### Header

```angular-ts
import { Component } from '@angular/core';

import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Model {
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'z-demo-item-header',
  imports: [...ZardItemImports],
  template: `
    <div class="flex w-full min-w-xl flex-col gap-6">
      <z-item-group class="grid grid-cols-3 gap-4">
        @for (model of models; track model.name) {
          <z-item zVariant="outline">
            <z-item-header>
              <img [src]="model.image" [alt]="model.name" class="aspect-square w-full rounded-sm object-cover" />
            </z-item-header>
            <z-item-content>
              <z-item-title>{{ model.name }}</z-item-title>
              <z-item-description>{{ model.description }}</z-item-description>
            </z-item-content>
          </z-item>
        }
      </z-item-group>
    </div>
  `,
})
export class ZardDemoItemHeaderComponent {
  protected readonly models: Model[] = [
    {
      name: 'v0-1.5-sm',
      description: 'Everyday tasks and UI generation.',
      image: 'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
    },
    {
      name: 'v0-1.5-lg',
      description: 'Advanced thinking or reasoning.',
      image: 'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
    },
    {
      name: 'v0-2.0-mini',
      description: 'Open Source model for everyone.',
      image: 'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
    },
  ];
}
```

### Link

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideExternalLink } from '@ng-icons/lucide';

import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-link',
  imports: [NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-4">
      <a z-item href="#">
        <z-item-content>
          <z-item-title>Visit our documentation</z-item-title>
          <z-item-description>Learn how to get started with our components.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideChevronRight" size="1rem" />
        </z-item-actions>
      </a>

      <a z-item href="#" zVariant="outline" target="_blank" rel="noopener noreferrer">
        <z-item-content>
          <z-item-title>External resource</z-item-title>
          <z-item-description>Opens in a new tab with security attributes.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideExternalLink" size="1rem" />
        </z-item-actions>
      </a>
    </div>
  `,
  viewProviders: [provideIcons({ lucideChevronRight, lucideExternalLink })],
})
export class ZardDemoItemLinkComponent {}
```

### Dropdown

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Person {
  username: string;
  avatar: string;
  email: string;
}

@Component({
  selector: 'z-demo-item-dropdown',
  imports: [ZardAvatarComponent, ZardButtonComponent, NgIcon, ...ZardDropdownImports, ...ZardItemImports],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">
      Select
      <ng-icon name="lucideChevronDown" />
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      @for (person of people; track person.username) {
        <z-dropdown-menu-item>
          <z-item zSize="xs" class="w-full p-2">
            <z-item-media>
              <z-avatar
                [zSrc]="person.avatar"
                [zFallback]="person.username.charAt(0).toUpperCase()"
                class="size-7 grayscale"
              />
            </z-item-media>
            <z-item-content class="gap-0">
              <z-item-title>{{ person.username }}</z-item-title>
              <z-item-description class="leading-none">{{ person.email }}</z-item-description>
            </z-item-content>
          </z-item>
        </z-dropdown-menu-item>
      }
    </z-dropdown-menu-content>
  `,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoItemDropdownComponent {
  protected readonly people: Person[] = [
    { username: 'zardui', avatar: 'https://github.com/zard-ui.png', email: 'zardui@example.com' },
    { username: 'srizzon', avatar: 'https://github.com/srizzon.png', email: 'srizzon@example.com' },
    { username: 'luizgomess', avatar: 'https://github.com/Luizgomess.png', email: 'luizgomess@example.com' },
  ];
}
```

## API Reference

### z-item

Container for an entry composed of media, content, and actions.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVariant]` | Visual style of the item. | `default \| outline \| muted` | `default` |
| `[zSize]` | Padding and density. | `default \| sm \| xs` | `default` |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-group

Wrapper around multiple items with consistent spacing.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-separator

Horizontal separator rendered between items in a group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-media

Slot for an icon, image, or custom media at the leading edge of the item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVariant]` | Media presentation. | `default \| icon \| image` | `default` |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-content

Main text/content area; usually wraps title and description.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-title

Primary heading for the item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-description

Supporting copy below the title.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-actions

Container for trailing buttons or controls.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-header

Optional header row rendered at the top of the item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-item-footer

Optional footer row rendered at the bottom of the item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/item)
