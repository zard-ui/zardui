import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { menuContentVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-content]',
  host: {
    '[class]': 'classes()',
  },
  hostDirectives: [CdkMenu],
})
export class ZardMenuContentDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuContentVariants(), this.class()));
}
