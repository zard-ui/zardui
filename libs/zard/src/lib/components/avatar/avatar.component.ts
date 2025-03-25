import { ChangeDetectionStrategy, Component, computed, effect, input, signal, ViewEncapsulation } from '@angular/core';
import { mergeClasses } from '../../shared/utils/utils';
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
      <img [src]="zImage()?.url" [alt]="zImage()?.alt || 'Avatar'" [class]="imgClasses" />
    }
    @if (!zLoadingSignal() && zImage()?.fallback) {
      <span class="text-base">{{ zImage()?.fallback }}</span>
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
            class="text-green-500 {{ iconClasses }}"
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
            class="text-red-500 {{ iconClasses }}"
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
            class="text-red-500 {{ iconClasses }}"
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
            class="text-yellow-400 {{ iconClasses }} rotate-y-180"
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
            class="text-stone-400/90 {{ iconClasses }}"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
      }
    }
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAvatarComponent {
  readonly zType = input<ZardAvatarVariants['zType']>('default');
  readonly zSize = input<ZardAvatarVariants['zSize'] | null>('default');
  readonly zShape = input<ZardAvatarVariants['zShape'] | null>('default');
  readonly zStatus = input<ZardAvatarVariants['zStatus'] | null>(null);
  readonly zImage = input<ZardAvatarImage['zImage'] | null>({ fallback: 'ZA' });
  readonly zLoading = input<ZardAvatarLoading['time']>(undefined); // input original (imutável)

  readonly class = input<string>('');

  protected readonly classes = computed(() => mergeClasses(avatarVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));

  protected get shapeClasses() {
    return this.zShape() === 'circle' ? 'rounded-full' : this.zShape() === 'square' ? 'rounded-none' : 'rounded-md';
  }
  protected get imgClasses() {
    return `absolute top-0 left-0 object-cover object-center w-full h-full bg-inherit hover:bg-muted/50 overflow-hidden ${this.shapeClasses} border-3 border-inherit`;
  }
  protected get iconClasses() {
    return `absolute ${this.shapeClasses === 'rounded-full' ? '-right-[2px] -bottom-[2px]' : '-right-[7px] -bottom-[7px]'} w-5 h-5`;
  }

  protected readonly zLoadingSignal = signal<number | undefined>(this.zLoading()); // Signal mutável
  constructor() {
    effect(() => {
      if (this.zLoading()) {
        this.zLoadingSignal.set(this.zLoading()); // Sincroniza zLoading inicial
        setTimeout(() => this.zLoadingSignal.set(undefined), this.zLoading());
      }
    });
  }
}
