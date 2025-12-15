import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { avatarVariants, imageVariants, type ZardImageVariants, type ZardAvatarVariants } from './avatar.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

export type ZardAvatarStatus = 'online' | 'offline' | 'doNotDisturb' | 'away';

@Component({
  selector: 'z-avatar, [z-avatar]',
  standalone: true,
  template: `
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span class="absolute z-0 m-auto text-base">{{ zFallback() }}</span>
    }

    @if (zSrc() && !imageError()) {
      <img
        [src]="zSrc()"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [hidden]="!imageLoaded()"
        (load)="onImageLoad()"
        (error)="onImageError()"
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
            class="absolute -right-[5px] -bottom-[5px] z-20 h-5 w-5 text-green-500"
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
            class="absolute -right-[5px] -bottom-[5px] z-20 h-5 w-5 text-red-500"
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
            class="absolute -right-[5px] -bottom-[5px] z-20 h-5 w-5 text-red-500"
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
            class="absolute -right-[5px] -bottom-[5px] z-20 h-5 w-5 rotate-y-180 text-yellow-400"
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
