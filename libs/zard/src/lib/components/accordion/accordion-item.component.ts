import { ChangeDetectionStrategy, Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import type { ClassValue } from 'clsx';

import { ZardAccordionComponent } from './accordion.component';
import { accordionContentVariants, accordionItemVariants, accordionTriggerVariants } from './accordion.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardEventManagerPlugin } from '../core/zard-event-manager-plugin';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-accordion-item',
  imports: [ZardIconComponent],
  template: `
    <button
      type="button"
      [id]="'accordion-' + zValue()"
      [class]="triggerClasses()"
      (click)="toggle()"
      (keydown.enter.prevent)="toggle()"
      (keydown.space.prevent)="toggle()"
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
          <ng-content />
        </div>
      </div>
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
  private accordion = inject(ZardAccordionComponent);
  private readonly eventPlugins = inject(EVENT_MANAGER_PLUGINS, { optional: true });

  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly class = input<ClassValue>('');

  readonly isOpen = signal(false);

  protected readonly itemClasses = computed(() => mergeClasses(accordionItemVariants(), this.class()));
  protected readonly triggerClasses = computed(() => mergeClasses(accordionTriggerVariants()));
  protected readonly contentClasses = computed(() => mergeClasses(accordionContentVariants({ isOpen: this.isOpen() })));

  constructor() {
    const zardProperlyInitialized = this.eventPlugins?.some(plugin => plugin instanceof ZardEventManagerPlugin);
    if (!zardProperlyInitialized) {
      throw new Error("Zard: Initialization missing. Please call `provideZard()` in your app's root providers.");
    }
  }

  toggle(): void {
    if (this.accordion) {
      this.accordion.toggleItem(this);
    } else {
      this.isOpen.update(v => !v);
    }
  }
}
