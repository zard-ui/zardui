import type { OverlayRef } from '@angular/cdk/overlay';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  input,
  numberAttribute,
  output,
  signal,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { hoverCardVariants } from './hover-card.variants';

export type ZardHoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[zHoverCard]',
  exportAs: 'zHoverCard',
})
export class ZardHoverCardDirective {
  readonly zContent = input.required<TemplateRef<void>>({
    alias: 'zHoverCard',
  });

  readonly zPlacement = input<ZardHoverCardPlacement>('bottom');

  readonly zOpenDelay = input(700, { transform: numberAttribute });

  readonly zCloseDelay = input(300, { transform: numberAttribute });

  readonly zVisible = input(false, { transform: booleanAttribute });

  readonly zVisibleChange = output<boolean>();
}

@Component({
  selector: 'z-hover-card',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zHoverCard',
})
export class ZardHoverCardComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(hoverCardVariants(), this.class()));
  private overlayRef?: OverlayRef;
  private readonly isOpen = signal(false);
  private openTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;

  private pointerOverTrigger = false;
  private pointerOverOverlay = false;
  private focusWithinTrigger = false;
  private focusWithinOverlay = false;
}
