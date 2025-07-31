### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">avatar.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { avatarVariants, imageVariants, ZardAvatarImage, ZardAvatarVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar',
  exportAs: 'zAvatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zLoading()) {
      <span class="icon-loader-circle animate-spin {{ zLoading() }}"></span>
    } @else {
      @if (zImage()?.fallback) {
        <span class="text-base absolute m-auto z-0">{{ zImage()?.fallback }}</span>
      }
      @if (zImage()?.url) {
        <img [src]="zImage()?.url" [alt]="zImage()?.alt || 'Avatar'" [class]="imgClasses()" />
      }
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
        @case ('invisible') {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--muted-foreground)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-[5px] -bottom-[5px] text-stone-400/90 w-5 h-5 z-20"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
      }
    }
  `,
  host: {
    '[class]': 'containerClasses()',
  },
})
export class ZardAvatarComponent {
  readonly zType = input<ZardAvatarVariants['zType']>('default');
  readonly zSize = input<ZardAvatarVariants['zSize'] | null>('default');
  readonly zShape = input<ZardAvatarVariants['zShape'] | null>('default');
  readonly zStatus = input<ZardAvatarVariants['zStatus'] | null>(null);
  readonly zBorder = input(false, { transform });
  readonly zLoading = input(false, { transform });
  readonly zImage = input<ZardAvatarImage['zImage'] | null>({ fallback: 'ZA' });

  readonly class = input<string>('');

  protected readonly containerClasses = computed(() =>
    mergeClasses(avatarVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape(), zBorder: this.zBorder() }), this.class()),
  );
  protected readonly imgClasses = computed(() => mergeClasses(imageVariants({ zShape: this.zShape() })));
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">avatar.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center box-content hover:bg-primary/90 cursor-default', {
  variants: {
    zType: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground shadow-sm shadow-black',
    },
    zSize: {
      default: 'w-12 h-12',
      sm: 'w-10 h-10',
      md: 'w-18 h-18',
      lg: 'w-37 h-37',
      full: 'w-full h-full',
    },
    zShape: {
      default: 'rounded-md',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    zStatus: {
      online: 'online',
      offline: 'offline',
      doNotDisturb: 'doNotDisturb',
      away: 'away',
      invisible: 'invisible',
    },
    zBorder: {
      true: 'border border-3 border-white',
    },
    zLoading: {
      true: 'opacity-100',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});

export const imageVariants = cva('relative object-cover object-center w-full h-full z-10', {
  variants: {
    zShape: {
      default: 'rounded-md',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zShape: 'default',
  },
});

export type ZardAvatarImage = {
  zImage: {
    fallback: string;
    url?: string;
    alt?: string;
  };
};
export type ZardAvatarVariants = VariantProps<typeof avatarVariants> & ZardAvatarImage;

```

