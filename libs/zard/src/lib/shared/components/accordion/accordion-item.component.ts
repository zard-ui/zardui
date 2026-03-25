import { AccordionContent, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import type { ZardAccordionComponent } from '@/shared/components/accordion/accordion.component';
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from '@/shared/components/accordion/accordion.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-accordion-item',
  imports: [NgIcon, AccordionPanel, AccordionTrigger, AccordionContent],
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
      <ng-icon
        name="lucideChevronDown"
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
  viewProviders: [provideIcons({ lucideChevronDown })],
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
