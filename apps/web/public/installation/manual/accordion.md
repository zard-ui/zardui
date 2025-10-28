

```angular-ts title="accordion.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { type AfterContentInit, ChangeDetectionStrategy, Component, computed, contentChildren, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardAccordionItemComponent } from './accordion-item.component';
import { accordionVariants } from './accordion.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-accordion',
  exportAs: 'zAccordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAccordionComponent implements AfterContentInit {
  readonly items = contentChildren(ZardAccordionItemComponent);

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');
  readonly zCollapsible = input<boolean>(true);
  readonly zDefaultValue = input<string | string[]>('');

  protected readonly classes = computed(() => mergeClasses(accordionVariants(), this.class()));

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

```



```angular-ts title="accordion.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const accordionVariants = cva('grid w-full', {
  variants: {},
  defaultVariants: {},
});

export const accordionItemVariants = cva('border-b border-border flex flex-1 flex-col', {
  variants: {},
  defaultVariants: {},
});

export const accordionTriggerVariants = cva(
  'cursor-pointer group flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 w-full',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const accordionContentVariants = cva('grid text-sm transition-all', {
  variants: {
    isOpen: {
      true: 'grid-rows-[1fr]',
      false: 'grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export type ZardAccordionVariants = VariantProps<typeof accordionVariants>;
export type ZardAccordionItemVariants = VariantProps<typeof accordionItemVariants>;
export type ZardAccordionTriggerVariants = VariantProps<typeof accordionTriggerVariants>;
export type ZardAccordionContentVariants = VariantProps<typeof accordionContentVariants>;

```



```angular-ts title="accordion-item.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardAccordionComponent } from './accordion.component';
import { accordionContentVariants, accordionItemVariants, accordionTriggerVariants } from './accordion.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-accordion-item',
  exportAs: 'zAccordionItem',
  standalone: true,
  imports: [ZardIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      role="button"
      [id]="'accordion-' + zValue()"
      [class]="triggerClasses()"
      (click)="toggle()"
      (keydown.enter)="onKeydown($any($event))"
      (keydown.space)="onKeydown($any($event))"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-controls]="'content-' + zValue()"
      tabindex="0"
    >
      {{ zTitle() }}
      <z-icon
        zType="chevron-down"
        class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
        [class]="isOpen() ? 'rotate-180' : ''"
      />
    </button>

    <div [class]="contentClasses()" [id]="'content-' + zValue()" [attr.data-state]="isOpen() ? 'open' : 'closed'" role="region" [attr.aria-labelledby]="'accordion-' + zValue()">
      <div class="overflow-hidden">
        <div class="pt-0 pb-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  host: {
    '[class]': 'itemClasses()',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
  },
})
export class ZardAccordionItemComponent {
  private cdr = inject(ChangeDetectorRef);

  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly class = input<ClassValue>('');

  private isOpenSignal = signal(false);

  accordion?: ZardAccordionComponent;

  isOpen = computed(() => this.isOpenSignal());

  protected readonly itemClasses = computed(() => mergeClasses(accordionItemVariants(), this.class()));
  protected readonly triggerClasses = computed(() => mergeClasses(accordionTriggerVariants()));
  protected readonly contentClasses = computed(() => mergeClasses(accordionContentVariants({ isOpen: this.isOpen() })));

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

  onKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    this.toggle();
  }
}

```

