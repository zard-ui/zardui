import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardAccordionItemComponent } from './accordion-item.component';
import { accordionVariants } from './accordion.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-accordion',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zAccordion',
})
export class ZardAccordionComponent implements AfterContentInit {
  readonly items = contentChildren(ZardAccordionItemComponent);

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');
  readonly zCollapsible = input<boolean>(true);
  readonly zDefaultValue = input<string | string[]>('');

  protected readonly classes = computed(() => mergeClasses(accordionVariants(), this.class()));

  ngAfterContentInit(): void {
    const defaultValue = this.zDefaultValue();
    if (defaultValue) {
      if (typeof defaultValue === 'string') {
        const item = this.items().find(i => i.zValue() === defaultValue);
        if (item) {
          item.isOpen.set(true);
        }
      } else if (Array.isArray(defaultValue)) {
        for (const value of defaultValue) {
          const item = this.items().find(item => item.zValue() === value);
          if (item) {
            item.isOpen.set(true);
          }
        }
      }
    }
  }

  toggleItem(selectedItem: ZardAccordionItemComponent): void {
    const isClosing = selectedItem.isOpen();

    if (this.zType() === 'single') {
      if (isClosing && !this.zCollapsible()) {
        return;
      }

      for (const item of this.items()) {
        const shouldBeOpen = item === selectedItem ? !item.isOpen() : false;
        item.isOpen.set(shouldBeOpen);
      }
    } else {
      if (isClosing && !this.zCollapsible()) {
        const openItemsCount = this.countOpenItems();
        if (openItemsCount <= 1) {
          return;
        }
      }

      selectedItem.isOpen.update(v => !v);
    }
  }

  private countOpenItems(): number {
    let count = 0;
    this.items().forEach(item => {
      if (item.isOpen()) {
        count++;
      }
    });
    return count;
  }
}
