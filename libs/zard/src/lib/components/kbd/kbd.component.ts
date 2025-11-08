import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { kbdVariants } from './kbd.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-kbd',
  exportAs: 'zKbd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<kbd><ng-content></ng-content></kbd> `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardKbdComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdVariants(), this.class()));
}
