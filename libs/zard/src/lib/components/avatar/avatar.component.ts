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
      <img [src]="zImage()?.url" [alt]="zImage()?.alt || 'Avatar'" class="absolute top-0 left-0 object-cover object-center w-full h-full bg-inherit hover:bg-muted/50" />
    }
    @if (!zLoadingSignal() && zImage()?.fallback) {
      <span class="text-base">{{ zImage()?.fallback }}</span>
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
  readonly zImage = input<ZardAvatarImage['zImage'] | null>({ fallback: 'ZA' });
  readonly zLoading = input<ZardAvatarLoading['time']>(undefined); // input original (imutável)

  readonly class = input<string>('');

  protected readonly classes = computed(() => mergeClasses(avatarVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));

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
