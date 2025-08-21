import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, computed, input } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuDividerVariants, ZardMenuDividerVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-divider]',
  exportAs: 'zMenuDivider',
  standalone: true,
  host: {
    role: 'separator',
    '[class]': 'classes()',
  },
})
export class ZardMenuDividerDirective {
  readonly class = input<ClassValue>('');

  private mode = computed(() => 'vertical' as ZardMenuDividerVariants['zMode']);

  protected readonly classes = computed(() =>
    mergeClasses(
      menuDividerVariants({
        zMode: this.mode(),
      }),
      this.class(),
    ),
  );
}
