import { ChangeDetectionStrategy, Component, computed, effect, input, signal, ViewEncapsulation } from '@angular/core';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { avatarVariants, ZardAvatarImage, ZardAvatarLoading, ZardAvatarVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar',
  exportAs: 'zAvatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zLoadingSignal()) {
      <span zType="cached" class="icon-loader-circle animate-spin"></span>
    }
    @if (!zLoadingSignal() && zImage()?.url) {
      <img [src]="zImage()?.url" [alt]="zImage()?.alt || 'Avatar'" [class]="imgClasses()" />
    }
    @if (!zLoadingSignal() && zImage()?.fallback) {
      <span class="text-base absolute m-auto z-0">{{ zImage()?.fallback }}</span>
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
            class="absolute -right-[5px] -bottom-[5px] text-green-500 w-5 h-5 z-2"
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
            class="absolute -right-[5px] -bottom-[5px] text-red-500 w-5 h-5 z-2"
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
            class="absolute -right-[5px] -bottom-[5px] text-red-500 w-5 h-5 z-2"
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
            class="absolute -right-[5px] -bottom-[5px] text-yellow-400 rotate-y-180 w-5 h-5 z-2"
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
            class="absolute -right-[5px] -bottom-[5px] text-stone-400/90 w-5 h-5 z-2"
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
  // Variants
  readonly zType = input<ZardAvatarVariants['zType']>('default');
  readonly zSize = input<ZardAvatarVariants['zSize'] | null>('default');
  readonly zShape = input<ZardAvatarVariants['zShape'] | null>('default');
  readonly zStatus = input<ZardAvatarVariants['zStatus'] | null>(null);
  readonly zBorder = input(false, { transform });
  // Params
  readonly zImage = input<ZardAvatarImage['zImage'] | null>({ fallback: 'ZA' });
  readonly zLoading = input<ZardAvatarLoading['time']>(undefined); // input original (imutável)
  protected readonly zLoadingSignal = signal<number | undefined>(this.zLoading());

  readonly class = input<string>('');

  protected readonly containerClasses = computed(() =>
    mergeClasses(avatarVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape(), zBorder: this.zBorder() }), this.class()),
  );
  protected readonly imgClasses = computed(() =>
    mergeClasses(avatarVariants({ zType: this.zType(), zShape: this.zShape(), zSize: this.zSize() }), 'relative object-cover object-center w-full h-full z-1'),
  );

  constructor() {
    effect(() => {
      if (this.zLoading()) {
        this.zLoadingSignal.set(this.zLoading()); // Sincroniza zLoading inicial
        setTimeout(() => this.zLoadingSignal.set(undefined), this.zLoading());
      }
    });
  }
}
