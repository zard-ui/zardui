### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">accordion.component.ts

```angular-ts showLineNumbers
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { ZardAccordionItemComponent } from './accordion-item.component';

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
  @ContentChildren(ZardAccordionItemComponent)
  items!: QueryList<ZardAccordionItemComponent>;

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');
  readonly zCollapsible = input<boolean>(true);
  readonly zDefaultValue = input<string | string[]>('');

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.items.forEach(item => {
        item.accordion = this;
      });

      const defaultValue = this.zDefaultValue();
      if (defaultValue) {
        if (typeof defaultValue === 'string') {
          const item = this.items.find(i => i.zValue() === defaultValue);
          if (item) {
            item.setOpen(true);
          }
        } else if (Array.isArray(defaultValue)) {
          defaultValue.forEach(value => {
            const item = this.items.find(i => i.zValue() === value);
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

      this.items.forEach(item => {
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
    this.items.forEach(item => {
      if (item.isOpen()) {
        count++;
      }
    });
    return count;
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">accordion-item.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { ZardAccordionComponent } from './accordion.component';

@Component({
  selector: 'z-accordion-item',
  exportAs: 'zAccordionItem',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="border-b border-border flex flex-1 flex-col cursor-pointer" [attr.data-state]="isOpen() ? 'open' : 'closed'">
      <button
        type="button"
        role="button"
        [id]="'accordion-' + zValue()"
        class="group flex flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-ring font-medium items-center justify-between px-0.5 py-4 text-sm w-full"
        [class]="class()"
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="'content-' + zValue()"
        tabindex="0"
      >
        <span class="group-hover:underline">
          {{ zTitle() }}
        </span>
        <div class="transition-transform duration-200 icon-chevron-down text-lg" [class]="isOpen() ? 'rotate-180' : ''"></div>
      </button>

      <div
        class="grid text-sm transition-all"
        [class]="isOpen() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        [id]="'content-' + zValue()"
        [attr.data-state]="isOpen() ? 'open' : 'closed'"
        role="region"
        [attr.aria-labelledby]="'accordion-' + zValue()"
      >
        <div class="overflow-hidden">
          <main class="pb-4 pt-1">
            <ng-content></ng-content>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class ZardAccordionItemComponent {
  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly class = input<ClassValue>('');

  private isOpenSignal = signal(false);

  accordion?: ZardAccordionComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  isOpen = computed(() => this.isOpenSignal());

  setOpen(open: boolean): void {
    this.isOpenSignal.set(open);
    this.cdr.markForCheck();
  }

  toggle(): void {
    if (this.accordion) {
      this.accordion.toggleItem(this);
    } else {
      this.setOpen(!this.isOpen());
    }
  }
}

```

