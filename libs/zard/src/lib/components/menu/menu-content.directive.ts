import { ClassValue } from 'class-variance-authority/dist/types';

import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuContentVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-content]',
  standalone: true,
  hostDirectives: [CdkMenu],
  host: {
    '[class]': 'classes()',
  },
})
export class ZardMenuContentDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuContentVariants(), this.class()));
}
