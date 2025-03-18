import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { cardBodyVariants, cardHeaderDescriptionVariants, cardHeaderTitleVariants, cardHeaderVariants, cardVariants } from './card.variants';

@Component({
  selector: 'z-card-body',
  exportAs: 'zCardBody',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardBodyComponent {
  protected readonly classes = computed(() => mergeClasses(cardBodyVariants()));
}

@Component({
  selector: 'z-card-header',
  exportAs: 'zCardHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardHeaderComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(cardHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-card-header-title',
  exportAs: 'zCardHeaderTitle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardHeaderTitleComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(cardHeaderTitleVariants(), this.class()));
}

@Component({
  selector: 'z-card-header-description',
  exportAs: 'zCardHeaderDescription',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardHeaderDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(cardHeaderDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-card',
  exportAs: 'zCard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
}
