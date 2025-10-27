

```angular-ts title="avatar.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { avatarVariants, imageVariants, ZardAvatarVariants, ZardImageVariants } from './avatar.variants';

export type ZardAvatarStatus = 'online' | 'offline' | 'doNotDisturb' | 'away';

@Component({
  selector: 'z-avatar, [z-avatar]',
  exportAs: 'zAvatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span class="text-base absolute m-auto z-0">{{ zFallback() }}</span>
    }

    @if (zSrc() && !imageError()) {
      <img [src]="zSrc()" [alt]="zAlt()" [class]="imgClasses()" [hidden]="!imageLoaded()" (load)="onImageLoad()" (error)="onImageError()" />
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
            class="absolute -right-[5px] -bottom-[5px] text-green-500 w-5 h-5 z-20"
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
            class="absolute -right-[5px] -bottom-[5px] text-red-500 w-5 h-5 z-20"
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
            class="absolute -right-[5px] -bottom-[5px] text-red-500 w-5 h-5 z-20"
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
            class="absolute -right-[5px] -bottom-[5px] text-yellow-400 rotate-y-180 w-5 h-5 z-20"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" />
          </svg>
        }
      }
    }
  `,
  host: {
    '[class]': 'containerClasses()',
    '[style.width]': 'customSize()',
    '[style.height]': 'customSize()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-status]': 'zStatus() ?? null',
  },
})
export class ZardAvatarComponent {
  readonly zStatus = input<ZardAvatarStatus>();
  readonly zShape = input<ZardImageVariants['zShape']>('circle');
  readonly zSize = input<ZardAvatarVariants['zSize'] | number>('default');
  readonly zSrc = input<string>();
  readonly zAlt = input<string>('');
  readonly zFallback = input<string>('');

  readonly class = input<string>('');

  protected readonly imageError = signal(false);
  protected readonly imageLoaded = signal(false);

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
import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center box-content cursor-default bg-muted', {
  variants: {
    zSize: {
      sm: 'w-8 h-8',
      default: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-14 h-14',
      xl: 'w-16 h-16',
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
});

export const imageVariants = cva('relative object-cover object-center w-full h-full z-10', {
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

import { mergeClasses } from '../../shared/utils/utils';
import { avatarGroupVariants, ZardAvatarGroupVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar-group',
  exportAs: 'zAvatarGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAvatarGroupComponent {
  readonly zOrientation = input<ZardAvatarGroupVariants['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(avatarGroupVariants({ zOrientation: this.zOrientation() }), this.class()));
}

```

