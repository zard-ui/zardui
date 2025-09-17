import { AfterContentInit, ChangeDetectionStrategy, Component, contentChildren, input, ViewEncapsulation } from '@angular/core';

import { ZardAccordionItemComponent } from './accordion-item.component';

import type { ClassValue } from 'clsx';

@Component({
  selector: 'z-accordion',
  exportAs: 'zAccordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="grid w-full" [class]="class()">
      <ng-content></ng-content>
    </div>
  `,
})
export class ZardAccordionComponent implements AfterContentInit {
  readonly items = contentChildren(ZardAccordionItemComponent);

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');
  readonly zCollapsible = input<boolean>(true);
  readonly zDefaultValue = input<string | string[]>('');

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.items().forEach(item => {
        item.accordion = this;
      });

      const defaultValue = this.zDefaultValue();
      if (defaultValue) {
        if (typeof defaultValue === 'string') {
          const item = this.items().find(i => i.zValue() === defaultValue);
          if (item) {
            item.setOpen(true);
          }
        } else if (Array.isArray(defaultValue)) {
          defaultValue.forEach(value => {
            const item = this.items().find(i => i.zValue() === value);
            if (item) {
              item.setOpen(true);
            }
          });
        }
      }
    });
  }

  toggleItem(selectedItem: ZardAccordionItemComponent): void {
    const isClosing = selectedItem.isOpen();

    if (this.zType() === 'single') {
      if (isClosing && !this.zCollapsible()) {
        return;
      }

      this.items().forEach(item => {
        const shouldBeOpen = item === selectedItem ? !item.isOpen() : false;
        item.setOpen(shouldBeOpen);
      });
    } else {
      if (isClosing && !this.zCollapsible()) {
        const openItemsCount = this.countOpenItems();
        if (openItemsCount <= 1) {
          return;
        }
      }

      selectedItem.setOpen(!selectedItem.isOpen());
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
