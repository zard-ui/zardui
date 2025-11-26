import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue } from 'clsx';

import { mergeClasses } from '@ngzard/ui/core';

import { kbdGroupVariants } from './kbd.variants';

@Component({
  selector: 'z-kbd-group, [z-kbd-group]',
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zKbdGroup',
})
export class ZardKbdGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdGroupVariants(), this.class()));
}
