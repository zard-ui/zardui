import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { nativeSelectVariants, type ZardNativeSelectSizeVariants } from './native-select.variants';

@Directive({
  selector: 'select[z-native-select]',
  host: {
    'data-slot': 'native-select',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zNativeSelect',
})
export class ZardNativeSelectDirective {
  readonly zSize = input<ZardNativeSelectSizeVariants>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(nativeSelectVariants({ zSize: this.zSize() }), this.class()),
  );
}
