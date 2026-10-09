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
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
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

/** Rendered `<img>` size (px) per `zSize`, matching `size-6`/`size-8`/`size-10` in `avatarVariants`. */
const AVATAR_IMAGE_SIZE: Record<ZardAvatarSizeVariants, number> = {
  sm: 24,
  default: 32,
  lg: 40,
};

@Component({
  selector: 'z-avatar, [z-avatar]',
  imports: [NgIcon],
  template: `
    @if (zFallback()) {
      <span [class]="fallbackClasses()" [attr.aria-hidden]="imageLoaded() ? 'true' : null">
        {{ zFallback() }}
      </span>
    }

    @if (zSrc() && !imageError()) {
      <img
        [width]="imgSize()"
        [height]="imgSize()"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [src]="imgSrc()"
        [attr.fetchpriority]="zPriority() ? 'high' : 'auto'"
        loading="eager"
        decoding="async"
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

  // Keyed on zSrc so a source change resets synchronously — no stale frame between sources.
  protected readonly imageError = linkedSignal(() => {
    this.zSrc();
    return false;
  });

  protected readonly imageLoaded = linkedSignal(() => {
    this.zSrc();
    return false;
  });

  protected readonly avatarClasses = computed(() =>
    mergeClasses(avatarVariants({ zSize: this.zSize() }), this.class()),
  );

  protected readonly fallbackClasses = computed(() => fallbackVariants());

  protected readonly badgeClasses = computed(() => mergeClasses(avatarBadgeVariants, this.zBadgeClass()));

  protected readonly imgSize = computed(() => AVATAR_IMAGE_SIZE[this.zSize()]);

  // `HTMLImageElement.src` is typed `string`; `SafeUrl` type-checks against `[ngSrc]` via
  // `NgOptimizedImage.ngAcceptInputType_ngSrc`, but a plain `<img [src]>` has no such escape
  // hatch under strictTemplates. The runtime binding still goes through Angular's URL
  // sanitizer/SafeValue unwrapping regardless of this compile-time assertion.
  protected readonly imgSrc = computed(() => this.zSrc() as string);

  protected readonly imgClasses = computed(() =>
    mergeClasses(imageVariants({ zSize: this.zSize() }), this.imageLoaded() && 'opacity-100'),
  );

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
  'bg-muted text-muted-foreground absolute inset-0 flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs',
);

export const imageVariants = cva(
  'absolute inset-0 aspect-square size-full rounded-full object-cover opacity-0 transition-opacity duration-200',
  {
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
  },
);

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

/**
 * The "+N" chip appended to a `z-avatar-group` for members the stack does not show.
 * Carries `data-slot="avatar"` so it also picks up the group's own ring/spacing rules.
 */
export const avatarGroupCountVariants = cva(
  'relative flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium ring-2 ring-background select-none',
  {
    variants: {
      zSize: {
        sm: 'size-6 text-xs',
        default: 'size-8 text-xs',
        lg: 'size-10 text-sm',
      },
    },
    defaultVariants: {
      zSize: 'default',
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

import { avatarGroupCountVariants, type ZardAvatarSizeVariants } from './avatar.variants';

/**
 * A "+N" chip for the members a `z-avatar-group` stack does not show. Drop it in as the
 * last child of `z-avatar-group`, next to the `z-avatar`s — it carries `data-slot="avatar"`
 * so the group's own ring and spacing rules apply to it too.
 */
@Component({
  selector: 'z-avatar-group-count, [z-avatar-group-count]',
  template: `
    +{{ zCount() }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-size]': 'zSize()',
  },
  exportAs: 'zAvatarGroupCount',
})
export class ZardAvatarGroupCountComponent {
  readonly class = input<ClassValue>('');
  readonly zCount = input<number>(0);
  readonly zSize = input<ZardAvatarSizeVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(avatarGroupCountVariants({ zSize: this.zSize() }), this.class()),
  );
}
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
export { ZardAvatarGroupCountComponent } from './avatar-group-count.component';
export { ZardAvatarGroupComponent } from './avatar-group.component';
export { ZardAvatarComponent } from './avatar.component';

/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardAvatarGroupCountComponent } from './avatar-group-count.component';
import { ZardAvatarGroupComponent } from './avatar-group.component';
import { ZardAvatarComponent } from './avatar.component';

/** Every part of the avatar component, for a template that uses more than one. */
export const ZardAvatarImports = [
  ZardAvatarComponent,
  ZardAvatarGroupComponent,
  ZardAvatarGroupCountComponent,
] as const;
```

```angular-ts
export * from './avatar-group-count.component';
export * from './avatar-group.component';
export * from './avatar.component';
export * from './avatar.imports';
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

Set `zSrc` for the image and `zFallback` for the text shown while it loads or if it errors.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarBasicComponent {}
```

### Sizes

`zSize` accepts `sm` (24px), `default` (32px) and `lg` (40px).

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-sizes',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex items-end gap-6">
      <div class="flex flex-col items-center gap-2">
        <z-avatar zSize="sm" zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="SM" />
        <span class="text-muted-foreground text-xs">sm — 24px</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <z-avatar zSize="default" zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="MD" />
        <span class="text-muted-foreground text-xs">default — 32px</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <z-avatar zSize="lg" zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="LG" />
        <span class="text-muted-foreground text-xs">lg — 40px</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarSizesComponent {}
```

### Badge

Set `zShowBadge` and `zBadgeClass` to render a status dot in the corner.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-badge',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Online"
        zBadgeClass="bg-green-600 dark:bg-green-500"
      />
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Away"
        zBadgeClass="bg-yellow-500 dark:bg-yellow-600"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarBadgeComponent {}
```

### Badge With Icon

Pass an icon name to `zBadgeIcon` to render it inside the badge instead of a plain dot.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-badge-with-icon',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Verified user"
        zBadgeIcon="lucideBadgeCheck"
        zBadgeClass="bg-blue-600 dark:bg-blue-700"
      />
      <z-avatar
        class="grayscale"
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="New member"
        zBadgeIcon="lucidePlus"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucidePlus })],
})
export class ZardDemoAvatarBadgeWithIconComponent {}
```

### Group

Wrap avatars in `z-avatar-group`; `zOrientation` switches between a horizontal and vertical stack.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarGroupComponent {}
```

### Group With Icon

A group member can carry an icon badge via `zBadgeIcon` to call out a role, such as a verified owner.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck } from '@ng-icons/lucide';

import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-group-with-icon',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent],
  template: `
    <z-avatar-group class="grayscale">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
      <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
      <z-avatar
        zSrc="https://github.com/Luizgomess.png"
        zFallback="LU"
        [zShowBadge]="true"
        zBadgeIcon="lucideBadgeCheck"
        zBadgeClass="bg-blue-600 dark:bg-blue-700"
      />
    </z-avatar-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck })],
})
export class ZardDemoAvatarGroupWithIconComponent {}
```

### Group Count

Append `z-avatar-group-count` with `zCount` to show how many more members the stack does not display.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarGroupCountComponent } from '@/shared/components/avatar/avatar-group-count.component';
import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-group-count',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardAvatarGroupCountComponent],
  template: `
    <z-avatar-group class="grayscale">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
      <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
      <z-avatar zSrc="https://github.com/Luizgomess.png" zFallback="LU" />
      <z-avatar-group-count [zCount]="3" />
    </z-avatar-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarGroupCountComponent {}
```

### Dropdown

Use an avatar as a `[z-dropdown]` trigger to open a `z-dropdown-menu-content` with account actions.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-avatar-dropdown',
  imports: [ZardDropdownImports, ZardButtonComponent, ZardAvatarComponent],
  template: `
    <button type="button" z-button zType="ghost" class="size-10 rounded-full p-0" z-dropdown [zDropdownMenu]="menu">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" zAlt="User avatar" />
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>
        <div class="flex flex-col space-y-1">
          <p class="text-sm leading-none font-medium">Zard User</p>
          <p class="text-muted-foreground text-xs leading-none">user@zardui.com</p>
        </div>
      </z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">Settings</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Log out')">Log out</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarDropdownComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
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

### z-avatar-group-count

A "+N" chip for the members a `z-avatar-group` stack does not show.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zCount]` | Number of additional members represented by the chip | `number` | `0` |
| `[zSize]` | Chip size variant, matching the sibling avatars | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[class]` | Additional CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/avatar)
