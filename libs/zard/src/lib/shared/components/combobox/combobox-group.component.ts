import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { comboboxGroupVariants, comboboxLabelVariants } from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardComboboxItemComponent } from './combobox-item.component';

let nextComboboxLabelId = 0;

@Component({
  selector: 'z-combobox-label, [z-combobox-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox-label',
    '[class]': 'classes()',
    '[id]': 'id',
  },
  exportAs: 'zComboboxLabel',
})
export class ZardComboboxLabelComponent {
  readonly class = input<ClassValue>('');

  readonly id = `z-combobox-label-${nextComboboxLabelId++}`;

  protected readonly classes = computed(() => mergeClasses(comboboxLabelVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-group, [z-combobox-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'combobox-group',
    '[attr.aria-labelledby]': 'label()?.id ?? null',
    '[attr.hidden]': 'isHidden() ? "" : null',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxGroup',
})
export class ZardComboboxGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly label = contentChild(ZardComboboxLabelComponent, { descendants: true });
  protected readonly items = contentChildren(ZardComboboxItemComponent, { descendants: true });

  protected readonly isHidden = computed(() => {
    const items = this.items();
    return items.length > 0 && items.every(item => item.isHidden());
  });

  protected readonly classes = computed(() => mergeClasses(comboboxGroupVariants(), this.class()));
}
