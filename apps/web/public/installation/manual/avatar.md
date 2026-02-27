

```angular-ts title="avatar.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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

import { mergeClasses } from '@/shared/utils/merge-classes';

import { avatarVariants, imageVariants, type ZardAvatarVariants, type ZardImageVariants } from './avatar.variants';

export type ZardAvatarStatus = 'online' | 'offline' | 'doNotDisturb' | 'away';

@Component({
  selector: 'z-avatar, [z-avatar]',
  imports: [NgOptimizedImage],
  template: `
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span class="absolute z-0 m-auto text-base">{{ zFallback() }}</span>
    }

    @if (zSrc() && !imageError()) {
      <img
        fill
        sizes="100%"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [ngSrc]="zSrc()"
        [priority]="zPriority()"
        (error)="onImageError()"
        (load)="onImageLoad()"
      />
    }

    @if (zStatus()) {
      @switch (zStatus()) {
        @case ('online') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-1.25 -bottom-1.25 z-20 size-5 text-green-500"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
        @case ('offline') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-1.25 -bottom-1.25 z-20 size-5 text-red-500"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
        @case ('doNotDisturb') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-1.25 -bottom-1.25 z-20 size-5 text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" fill="currentColor" />
          </svg>
        }
        @case ('away') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-1.25 -bottom-1.25 z-20 size-5 rotate-y-180 text-yellow-400"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" />
          </svg>
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'containerClasses()',
    '[style.width]': 'customSize()',
    '[style.height]': 'customSize()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-status]': 'zStatus() ?? null',
  },
  exportAs: 'zAvatar',
})
export class ZardAvatarComponent {
  readonly class = input<string>('');
  readonly zAlt = input<string>('');
  readonly zFallback = input<string>('');
  readonly zPriority = input(false, { transform: booleanAttribute });
  readonly zShape = input<ZardImageVariants['zShape']>('circle');
  readonly zSize = input<ZardAvatarVariants['zSize'] | number>('default');
  readonly zSrc = input<string | SafeUrl>('');
  readonly zStatus = input<ZardAvatarStatus>();

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

  protected readonly containerClasses = computed(() => {
    const size = this.zSize();
    const zSize = typeof size === 'number' ? undefined : (size as ZardAvatarVariants['zSize']);

    return mergeClasses(avatarVariants({ zShape: this.zShape(), zSize }), this.class());
  });

  protected readonly customSize = computed(() => {
    const size = this.zSize();
    return typeof size === 'number' ? `${size}px` : null;
  });

  protected readonly imgClasses = computed(() => mergeClasses(imageVariants({ zShape: this.zShape() })));

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



```angular-ts title="avatar.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative flex flex-row items-center justify-center box-content cursor-default bg-muted',
  {
    variants: {
      zSize: {
        sm: 'size-8',
        default: 'size-10',
        md: 'size-12',
        lg: 'size-14',
        xl: 'size-16',
      },
      zShape: {
        circle: 'rounded-full',
        rounded: 'rounded-md',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zShape: 'circle',
    },
  },
);

export const imageVariants = cva('relative object-cover object-center size-full z-10', {
  variants: {
    zShape: {
      circle: 'rounded-full',
      rounded: 'rounded-md',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zShape: 'circle',
  },
});

export const avatarGroupVariants = cva('flex items-center [&_img]:ring-2 [&_img]:ring-background', {
  variants: {
    zOrientation: {
      horizontal: 'flex-row -space-x-3',
      vertical: 'flex-col -space-y-3',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardAvatarVariants = VariantProps<typeof avatarVariants>;
export type ZardImageVariants = VariantProps<typeof imageVariants>;
export type ZardAvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;

```



```angular-ts title="avatar-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { avatarGroupVariants, type ZardAvatarGroupVariants } from './avatar.variants';

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
  readonly zOrientation = input<ZardAvatarGroupVariants['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(avatarGroupVariants({ zOrientation: this.zOrientation() }), this.class()),
  );
}

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './avatar.component';
export * from './avatar-group.component';
export * from './avatar.variants';

```

