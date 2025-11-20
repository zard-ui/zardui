import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { menuContentVariants } from './menu.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Directive({
  selector: '[z-menu-content]',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
  hostDirectives: [CdkMenu],
})
export class ZardMenuContentDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuContentVariants(), this.class()));
}
