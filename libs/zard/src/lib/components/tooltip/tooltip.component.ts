import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, signal } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardTooltipPositions } from './tooltip-positions';
import { ZardTooltipTriggers } from './tooltip.directive';
import { tooltipVariants } from './tooltip.variants';

@Component({
  selector: 'z-tooltip',
  template: `{{ text() }}`,
  host: {
    '[class]': 'classes()',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardTooltipComponent implements OnDestroy {
  readonly elementRef = inject(ElementRef);
  private readonly destroy$ = new Subject<void>();

  private position = signal<ZardTooltipPositions>('top');
  private trigger = signal<ZardTooltipTriggers>('hover');
  protected text = signal<string>('');

  state = signal<'closed' | 'opened'>('closed');

  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  overlayClickOutside() {
    return fromEvent<MouseEvent>(document, 'click').pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        return !this.elementRef.nativeElement.contains(clickTarget);
      }),
      takeUntil(this.destroy$),
    );
  }

  setProps(text: string, position: ZardTooltipPositions, trigger: ZardTooltipTriggers) {
    this.text.set(text);
    this.position.set(position);
    this.trigger.set(trigger);
  }
}
