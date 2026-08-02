import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  cardActionVariants,
  cardContentVariants,
  cardDescriptionVariant,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleVariant,
  cardVariants,
  type ZardCardSizeType,
} from './card.variants';

@Component({
  selector: 'z-card-title, [z-card-title]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let title = zTitle();
    <ng-container *zStringTemplateOutlet="title">{{ title }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-title',
    '[class]': 'classes()',
  },
  exportAs: 'zCardTitle',
})
export class ZardCardTitleComponent {
  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>();

  protected readonly classes = computed(() => mergeClasses(cardTitleVariant(), this.class()));
}

@Component({
  selector: 'z-card-description, [z-card-description]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let description = zDescription();
    <ng-container *zStringTemplateOutlet="description">{{ description }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-description',
    '[class]': 'classes()',
  },
  exportAs: 'zCardDescription',
})
export class ZardCardDescriptionComponent {
  readonly class = input<ClassValue>('');
  readonly zDescription = input<string | TemplateRef<void>>();

  protected readonly classes = computed(() => mergeClasses(cardDescriptionVariant(), this.class()));
}

@Component({
  selector: 'z-card-action, [z-card-action]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-action',
    '[class]': 'classes()',
  },
  exportAs: 'zCardAction',
})
export class ZardCardActionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardActionVariants(), this.class()));
}

@Component({
  selector: 'z-card-header, [z-card-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-header',
    '[class]': 'classes()',
  },
  exportAs: 'zCardHeader',
})
export class ZardCardHeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zHeaderBorder = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(cardHeaderVariants(), this.zHeaderBorder() ? 'border-b' : '', this.class()),
  );
}

@Component({
  selector: 'z-card-content, [z-card-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-content',
    '[class]': 'classes()',
  },
  exportAs: 'zCardContent',
})
export class ZardCardContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardContentVariants(), this.class()));
}

@Component({
  selector: 'z-card-footer, [z-card-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zCardFooter',
})
export class ZardCardFooterComponent {
  readonly class = input<ClassValue>('');
  readonly zFooterBorder = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(cardFooterVariants(), this.zFooterBorder() ? 'border-t' : '', this.class()),
  );
}

@Component({
  selector: 'z-card, [z-card]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zCard',
})
export class ZardCardComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardCardSizeType>('default');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
}
