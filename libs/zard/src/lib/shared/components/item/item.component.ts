import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  itemActionsVariants,
  itemContentVariants,
  itemDescriptionVariants,
  itemFooterVariants,
  itemGroupVariants,
  itemHeaderVariants,
  itemMediaVariants,
  itemSeparatorVariants,
  itemTitleVariants,
  itemVariants,
  type ZardItemMediaVariantVariants,
  type ZardItemSizeVariants,
  type ZardItemVariantVariants,
} from './item.variants';

@Component({
  selector: 'z-item-group, [z-item-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'list',
    'data-slot': 'item-group',
    '[class]': 'classes()',
  },
  exportAs: 'zItemGroup',
})
export class ZardItemGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemGroupVariants(), this.class()));
}

@Component({
  selector: 'z-item-separator, [z-item-separator]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
    'data-slot': 'item-separator',
    '[class]': 'classes()',
  },
  exportAs: 'zItemSeparator',
})
export class ZardItemSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemSeparatorVariants(), this.class()));
}

@Component({
  selector: 'z-item, [z-item]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item',
    '[attr.data-variant]': 'zVariant()',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zItem',
})
export class ZardItemComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardItemVariantVariants>('default');
  readonly zSize = input<ZardItemSizeVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(itemVariants({ zVariant: this.zVariant(), zSize: this.zSize() }), this.class()),
  );
}

@Component({
  selector: 'z-item-media, [z-item-media]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-media',
    '[attr.data-variant]': 'zVariant()',
    '[class]': 'classes()',
  },
  exportAs: 'zItemMedia',
})
export class ZardItemMediaComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardItemMediaVariantVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(itemMediaVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-item-content, [z-item-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-content',
    '[class]': 'classes()',
  },
  exportAs: 'zItemContent',
})
export class ZardItemContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemContentVariants(), this.class()));
}

@Component({
  selector: 'z-item-title, [z-item-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-title',
    '[class]': 'classes()',
  },
  exportAs: 'zItemTitle',
})
export class ZardItemTitleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemTitleVariants(), this.class()));
}

@Component({
  selector: 'z-item-description, p[z-item-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-description',
    '[class]': 'classes()',
  },
  exportAs: 'zItemDescription',
})
export class ZardItemDescriptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-item-actions, [z-item-actions]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-actions',
    '[class]': 'classes()',
  },
  exportAs: 'zItemActions',
})
export class ZardItemActionsComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemActionsVariants(), this.class()));
}

@Component({
  selector: 'z-item-header, [z-item-header]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-header',
    '[class]': 'classes()',
  },
  exportAs: 'zItemHeader',
})
export class ZardItemHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-item-footer, [z-item-footer]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'item-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zItemFooter',
})
export class ZardItemFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(itemFooterVariants(), this.class()));
}
