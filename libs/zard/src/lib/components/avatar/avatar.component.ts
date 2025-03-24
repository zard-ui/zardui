import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { avatarVariants, ZardAvatarImage, ZardAvatarVariants } from './avatar.variants';

@Component({
  selector: 'z-avatar',
  exportAs: 'zAvatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zImage()?.url) {
      <img [src]="zImage()?.url" [alt]="zImage()?.alt || 'Avatar'" class="absolute top-0 left-0 object-cover object-center w-full h-full bg-inherit hover:bg-muted/50" />
    }
    @if (!zImage()?.url && zImage()?.fallback) {
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

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(avatarVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));
}
