import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { avatarGroupVariants, ZardAvatarGroupVariants } from './avatar.variants';
import { mergeClasses } from '../../shared/utils/utils';

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

  protected readonly classes = computed(() =>
    mergeClasses(avatarGroupVariants({ zOrientation: this.zOrientation() }), this.class()),
  );
}
