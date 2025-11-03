import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue } from 'clsx';

import { kbdGroupVariants } from './kbd.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-kbd-group',
  exportAs: 'zKbdGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <ng-content></ng-content> `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardKbdGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdGroupVariants(), this.class()));
}
