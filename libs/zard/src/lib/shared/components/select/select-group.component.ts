import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  selectGroupVariants,
  selectLabelVariants,
  selectSeparatorVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-select-group, [z-select-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'select-group',
    role: 'group',
    '[class]': 'classes()',
  },
  exportAs: 'zSelectGroup',
})
export class ZardSelectGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(selectGroupVariants(), this.class()));
}

@Component({
  selector: 'z-select-label, [z-select-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'select-label',
    '[class]': 'classes()',
  },
  exportAs: 'zSelectLabel',
})
export class ZardSelectLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(selectLabelVariants(), this.class()));
}

@Component({
  selector: 'z-select-separator, [z-select-separator]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'select-separator',
    role: 'separator',
    '[class]': 'classes()',
  },
  exportAs: 'zSelectSeparator',
})
export class ZardSelectSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(selectSeparatorVariants(), this.class()));
}
