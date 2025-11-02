import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

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

    <div
      [class]="contentClasses()"
      [id]="'content-' + zValue()"
      [attr.data-state]="isOpen() ? 'open' : 'closed'"
      role="region"
      [attr.aria-labelledby]="'accordion-' + zValue()"
    >
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
