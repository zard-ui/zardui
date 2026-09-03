import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { avatarGroupCountVariants, type ZardAvatarSizeVariants } from './avatar.variants';

/**
 * A "+N" chip for the members a `z-avatar-group` stack does not show. Drop it in as the
 * last child of `z-avatar-group`, next to the `z-avatar`s — it carries `data-slot="avatar"`
 * so the group's own ring and spacing rules apply to it too.
 */
@Component({
  selector: 'z-avatar-group-count, [z-avatar-group-count]',
  template: `
    +{{ zCount() }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-size]': 'zSize()',
  },
  exportAs: 'zAvatarGroupCount',
})
export class ZardAvatarGroupCountComponent {
  readonly class = input<ClassValue>('');
  readonly zCount = input<number>(0);
  readonly zSize = input<ZardAvatarSizeVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(avatarGroupCountVariants({ zSize: this.zSize() }), this.class()),
  );
}
