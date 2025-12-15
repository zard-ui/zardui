import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { avatarGroupVariants, ZardAvatarGroupVariants } from './avatar.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-avatar-group',
  standalone: true,
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
