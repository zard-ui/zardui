---
title: Avatar
description: An image element with a fallback for representing the user.
---

# Avatar

An image element with a fallback for representing the user.

## Installation

### CLI

```bash
npx zard-cli@latest add avatar
```

### Manual

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import type { SafeUrl } from '@angular/platform-browser';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  avatarVariants,
  avatarBadgeVariants,
  fallbackVariants,
  imageVariants,
  type ZardAvatarSizeVariants,
} from './avatar.variants';

@Component({
  selector: 'z-avatar, [z-avatar]',
  imports: [NgOptimizedImage, NgIcon],
  template: `
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span [class]="fallbackClasses()">
        {{ zFallback() }}
      </span>
    }

    @if (zSrc() && !imageError()) {
      <img
        [width]="32"
        [height]="32"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [ngSrc]="zSrc()"
        [priority]="zPriority()"
        (error)="onImageError()"
        (load)="onImageLoad()"
      />
    }

    @if (zShowBadge()) {
      <div [class]="badgeClasses()">
        @if (zBadgeIcon()) {
          <ng-icon [name]="zBadgeIcon()" size="8" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'avatarClasses()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-size]': 'zSize()',
  },
  exportAs: 'zAvatar',
})
export class ZardAvatarComponent {
  readonly class = input<ClassValue>('');
  readonly zAlt = input<string>('');
  readonly zBadgeClass = input<ClassValue>('');
  readonly zBadgeIcon = input<string>('');
  readonly zFallback = input<string>('');
  readonly zPriority = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardAvatarSizeVariants>('default');
  readonly zSrc = input<string | SafeUrl>('');
  readonly zShowBadge = input(false, { transform: booleanAttribute });

  protected readonly imageError = signal(false);
  protected readonly imageLoaded = signal(false);

  constructor() {
    effect(() => {
      // Reset image state when zSrc changes
      this.zSrc();
      this.imageError.set(false);
      this.imageLoaded.set(false);
    });
  }

  protected readonly avatarClasses = computed(() =>
    mergeClasses(avatarVariants({ zSize: this.zSize() }), this.class()),
  );

  protected readonly fallbackClasses = computed(() => fallbackVariants());

  protected readonly badgeClasses = computed(() => mergeClasses(avatarBadgeVariants, this.zBadgeClass()));

  protected readonly imgClasses = computed(() => imageVariants({ zSize: this.zSize() }));

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  protected onImageError(): void {
    this.imageError.set(true);
    this.imageLoaded.set(false);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils';

export const avatarVariants = cva(
  mergeClasses(
    'group/avatar relative flex shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border',
    'after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
  ),
  {
    variants: {
      zSize: {
        sm: 'size-6',
        default: 'size-8',
        lg: 'size-10',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const fallbackVariants = cva(
  'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
);

export const imageVariants = cva('aspect-square size-full rounded-full object-cover', {
  variants: {
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const avatarBadgeVariants = mergeClasses(
  'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none',
  'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
  'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
  'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
);

export const avatarGroupVariants = cva(
  'group/avatar-group flex *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background',
  {
    variants: {
      zOrientation: {
        horizontal: 'flex-row -space-x-2',
        vertical: 'flex-col -space-y-2',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);

export type ZardAvatarSizeVariants = NonNullable<VariantProps<typeof avatarVariants>['zSize']>;
export type ZardAvatarGroupOrientationVariants = NonNullable<VariantProps<typeof avatarGroupVariants>['zOrientation']>;
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { avatarGroupVariants, type ZardAvatarGroupOrientationVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar-group',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zAvatarGroup',
})
export class ZardAvatarGroupComponent {
  readonly zOrientation = input<ZardAvatarGroupOrientationVariants>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(avatarGroupVariants({ zOrientation: this.zOrientation() }), this.class()),
  );
}
```

```angular-ts
export * from './avatar.component';
export * from './avatar-group.component';
export * from './avatar.variants';
```

## Usage

```angular-ts
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
```

```angular-html
<z-avatar zSrc="https://github.com/shadcn.png" zAlt="@shadcn"></z-avatar>
```

## Examples

### Basic

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-basic',
  imports: [ZardAvatarComponent],
  template: `
    <div class="mb-4 flex gap-3">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" />
      <z-avatar zSrc="error-image.png" zFallback="ZA" />
    </div>
  `,
})
export class ZardDemoAvatarBasicComponent {}
```

### Badge

```angular-ts
import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-badge',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Image"
        zBadgeClass="bg-green-600 dark:bg-green-800"
      />
      <z-avatar
        class="grayscale"
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Image"
        zBadgeIcon="lucidePlus"
      />
    </div>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoAvatarBadgeComponent {}
```

### Group

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-group',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-avatar-group class="grayscale">
        <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
        <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
        <z-avatar zSrc="https://github.com/Luizgomess.png" zFallback="LU" />
      </z-avatar-group>

      <z-avatar-group zOrientation="vertical" class="grayscale">
        <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
        <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
        <z-avatar zSrc="https://github.com/Luizgomess.png" zFallback="LU" />
      </z-avatar-group>
    </div>
  `,
})
export class ZardDemoAvatarGroupComponent {}
```

## API Reference

### z-avatar

An image element with a fallback for representing the user.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `string` | `''` |
| `[zAlt]` | Image alt text for accessibility | `string` | `''` |
| `[zFallback]` | Fallback text displayed while loading or on error | `string` | `''` |
| `[zPriority]` | Should image load with high priority | `boolean` | `false` |
| `[zSize]` | Avatar size variant | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[zSrc]` | Image source URL | `string \| SafeUrl` | `''` |
| `[zShowBadge]` | Show avatar badge | `boolean` | `false` |
| `[zBadgeClass]` | Additional avatar badge classes | `ClassValue` | `''` |
| `[zBadgeIcon]` | Avatar badge icon | `string` | `''` |

### z-avatar-group

A group container for displaying multiple avatars.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zOrientation]` | Layout direction of avatars | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `[class]` | Additional CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/avatar)
