import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { avatarVariants, imageVariants, ZardAvatarVariants, ZardImageVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar',
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
    '[attr.data-slot]': '"avatar"',
  },
})
export class ZardAvatarComponent {
  readonly zStatus = input<ZardAvatarVariants['zStatus']>();
  readonly zShape = input<ZardImageVariants['zShape']>('circle');
  readonly zSize = input<ZardAvatarVariants['zSize']>('default');
  readonly zSrc = input<string>();
  readonly zAlt = input<string>('');
  readonly zFallback = input<string>('');

  readonly class = input<string>('');

  protected readonly imageError = signal(false);
  protected readonly imageLoaded = signal(false);

  protected readonly containerClasses = computed(() => mergeClasses(avatarVariants({ zShape: this.zShape(), zSize: this.zSize(), zStatus: this.zStatus() }), this.class()));
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
