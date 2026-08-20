import { ChangeDetectionStrategy, Component, computed, contentChild, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  bubbleContentVariants,
  bubbleGroupVariants,
  bubbleReactionsVariants,
  bubbleVariants,
  type ZardBubbleAlignVariants,
  type ZardBubbleReactionsAlignVariants,
  type ZardBubbleReactionsSideVariants,
  type ZardBubbleVariantVariants,
} from './bubble.variants';

@Component({
  selector: 'z-bubble-group, [z-bubble-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble-group',
    '[class]': 'classes()',
  },
  exportAs: 'zBubbleGroup',
})
export class ZardBubbleGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(bubbleGroupVariants(), this.class()));
}

@Component({
  selector: 'z-bubble-content, [z-bubble-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble-content',
    '[class]': 'classes()',
  },
  exportAs: 'zBubbleContent',
})
export class ZardBubbleContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(bubbleContentVariants(), this.class()));
}

@Component({
  selector: 'z-bubble, [z-bubble]',
  template: `
    <ng-content select="z-bubble-content, [z-bubble-content]" />
    <ng-content select="z-bubble-reactions, [z-bubble-reactions]" />
    @if (!hasContent()) {
      <div data-slot="bubble-content" [class]="contentClasses()">
        <ng-content />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble',
    '[attr.data-variant]': 'zVariant()',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
  },
  exportAs: 'zBubble',
})
export class ZardBubbleComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardBubbleVariantVariants>('default');
  readonly zAlign = input<ZardBubbleAlignVariants>('start');

  /**
   * A bubble with no `z-bubble-content` child gets the content surface for free, so
   * `<z-bubble>Hey there!</z-bubble>` is enough for a plain turn. Projecting the
   * content explicitly is what unlocks the rich cases — a `class` override, or the
   * whole turn rendered as a button or anchor.
   */
  private readonly projectedContent = contentChild(ZardBubbleContentComponent, { descendants: false });

  protected readonly hasContent = computed(() => !!this.projectedContent());
  protected readonly contentClasses = computed(() => bubbleContentVariants());
  protected readonly classes = computed(() =>
    mergeClasses(bubbleVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-bubble-reactions, [z-bubble-reactions]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble-reactions',
    '[attr.data-side]': 'zSide()',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
  },
  exportAs: 'zBubbleReactions',
})
export class ZardBubbleReactionsComponent {
  readonly class = input<ClassValue>('');
  readonly zSide = input<ZardBubbleReactionsSideVariants>('bottom');
  readonly zAlign = input<ZardBubbleReactionsAlignVariants>('end');

  protected readonly classes = computed(() =>
    mergeClasses(bubbleReactionsVariants({ zSide: this.zSide(), zAlign: this.zAlign() }), this.class()),
  );
}
