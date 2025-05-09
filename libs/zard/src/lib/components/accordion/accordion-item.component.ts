import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { ZardAccordionComponent } from './accordion.component';

@Component({
  selector: 'z-accordion-item',
  exportAs: 'zAccordionItem',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="border-b border-border flex flex-1 flex-col cursor-pointer" [attr.data-state]="isOpen() ? 'open' : 'closed'">
      <button
        type="button"
        role="button"
        [id]="'accordion-' + zValue()"
        class="group flex flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-ring font-medium items-center justify-between px-0.5 py-4 text-sm w-full"
        [class]="class()"
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="'content-' + zValue()"
        tabindex="0"
      >
        <span class="group-hover:underline">
          {{ zTitle() }}
        </span>
        <div class="transition-transform duration-200 icon-chevron-down text-lg" [class]="isOpen() ? 'rotate-180' : ''"></div>
      </button>

      <div
        class="grid text-sm transition-all"
        [class]="isOpen() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        [id]="'content-' + zValue()"
        [attr.data-state]="isOpen() ? 'open' : 'closed'"
        role="region"
        [attr.aria-labelledby]="'accordion-' + zValue()"
      >
        <div class="overflow-hidden">
          <main class="pb-4 pt-1">
            <ng-content></ng-content>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class ZardAccordionItemComponent {
  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly class = input<ClassValue>('');

  private isOpenSignal = signal(false);

  accordion?: ZardAccordionComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  isOpen = computed(() => this.isOpenSignal());

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
}
