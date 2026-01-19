

```angular-ts title="accordion.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { AccordionGroup } from '@angular/aria/accordion';
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

import { ZardAccordionItemComponent } from '@/shared/components/accordion/accordion-item.component';
import { accordionVariants } from '@/shared/components/accordion/accordion.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-accordion',
  imports: [AccordionGroup],
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  hostDirectives: [
    {
      directive: AccordionGroup,
      inputs: ['multiExpandable: multiMode'],
    },
  ],
  exportAs: 'zAccordion',
})
export class ZardAccordionComponent implements AfterContentInit {
  readonly items = contentChildren(ZardAccordionItemComponent);

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');
  readonly zCollapsible = input<boolean>(true);
  readonly zDefaultValue = input<string | string[]>('');

  private readonly defaultValue = computed(() => {
    const defaultValue = this.zDefaultValue();
    if (typeof defaultValue === 'string') {
      return defaultValue ? [defaultValue] : [];
    } else if (this.zType() === 'single') {
      throw new Error('Array of default values is supported only for multiple zType');
    }
    return defaultValue;
  });

  protected readonly classes = computed(() => mergeClasses(accordionVariants(), this.class()));
  protected readonly multiMode = computed(() => this.zType() === 'multiple');

  ngAfterContentInit(): void {
    for (const item of this.items()) {
      item.accordion = this;
      item.isOpen.set(this.defaultValue().includes(item.zValue()));
    }
  }

  toggleItem(selectedItem: ZardAccordionItemComponent): void {
    if (this.zType() === 'single') {
      this.toggleForSingleType(selectedItem);
    } else {
      this.toggleForMultipleType(selectedItem);
    }
  }

  private toggleForSingleType(selectedItem: ZardAccordionItemComponent): void {
    const isClosing = selectedItem.isOpen();

    if (isClosing && !this.zCollapsible()) {
      return;
    }

    for (const item of this.items()) {
      const shouldBeOpen = item === selectedItem ? !item.isOpen() : false;
      item.isOpen.set(shouldBeOpen);
    }
  }

  private toggleForMultipleType(selectedItem: ZardAccordionItemComponent): void {
    const isClosing = selectedItem.isOpen();
    if (isClosing && !this.zCollapsible() && this.countOpenItems() <= 1) {
      return;
    }

    selectedItem.isOpen.update(v => !v);
  }

  private countOpenItems(): number {
    return this.items().reduce((counter, item) => (item.isOpen() ? ++counter : counter), 0);
  }
}

```



```angular-ts title="accordion.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva } from 'class-variance-authority';

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

```



```angular-ts title="accordion-item.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { AccordionContent, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardAccordionComponent } from '@/shared/components/accordion/accordion.component';
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from '@/shared/components/accordion/accordion.variants';
import { ZardIconComponent } from '@/shared/components/icon';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-accordion-item',
  imports: [ZardIconComponent, AccordionPanel, AccordionTrigger, AccordionContent],
  template: `
    <button
      type="button"
      ngAccordionTrigger
      [panelId]="'accordion-' + zValue()"
      [class]="triggerClasses()"
      [expanded]="isOpen()"
      (click)="toggle()"
    >
      {{ zTitle() }}
      <z-icon
        [zType]="icon()"
        class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
      />
    </button>

    <div ngAccordionPanel [panelId]="'accordion-' + zValue()" [class]="contentClasses()">
      <ng-template ngAccordionContent>
        <div class="overflow-hidden">
          <div class="pt-0 pb-4">
            <ng-content />
          </div>
        </div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'itemClasses()',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
  },
  exportAs: 'zAccordionItem',
})
export class ZardAccordionItemComponent {
  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly class = input<ClassValue>('');

  accordion!: ZardAccordionComponent;
  readonly isOpen = signal(false);

  protected readonly itemClasses = computed(() => mergeClasses(accordionItemVariants(), this.class()));
  protected readonly triggerClasses = computed(() => mergeClasses(accordionTriggerVariants()));
  protected readonly contentClasses = computed(() => mergeClasses(accordionContentVariants({ isOpen: this.isOpen() })));
  protected readonly icon = computed(() => (this.isOpen() ? 'chevron-up' : 'chevron-down'));

  toggle(): void {
    if (this.accordion) {
      this.accordion.toggleItem(this);
    } else {
      this.isOpen.update(v => !v);
    }
  }
}

```



```angular-ts title="accordion.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ZardAccordionItemComponent } from '@/shared/components/accordion/accordion-item.component';
import { ZardAccordionComponent } from '@/shared/components/accordion/accordion.component';

export const ZardAccordionImports = [ZardAccordionComponent, ZardAccordionItemComponent] as const;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from '@/shared/components/accordion/accordion.component';
export * from '@/shared/components/accordion/accordion-item.component';
export * from '@/shared/components/accordion/accordion.variants';
export * from '@/shared/components/accordion/accordion.imports';

```

