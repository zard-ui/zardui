import { filter, fromEvent, Subject } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class ZardTooltipComponent implements OnInit, OnDestroy {
  readonly elementRef = inject(ElementRef);

  private position = signal<ZardTooltipPositions>('top');
  private trigger = signal<ZardTooltipTriggers>('hover');
  protected text = signal<string>('');

  state = signal<'closed' | 'opened'>('closed');

  private onLoadSubject$ = new Subject<void>();
  onLoad$ = this.onLoadSubject$.asObservable();

  protected readonly classes = computed(() => mergeClasses(tooltipVariants()));

  ngOnInit(): void {
    this.onLoadSubject$.next();
  }

  ngOnDestroy() {
    this.onLoadSubject$.complete();
  }

  overlayClickOutside() {
    return fromEvent<MouseEvent>(document, 'click').pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        return !this.elementRef.nativeElement.contains(clickTarget);
      }),
      takeUntilDestroyed(),
    );
  }

  setProps(text: string, position: ZardTooltipPositions, trigger: ZardTooltipTriggers) {
    this.text.set(text);
    this.position.set(position);
    this.trigger.set(trigger);
  }
}
