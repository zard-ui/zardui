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
    <div class="border-b" [attr.data-state]="isOpen() ? 'open' : 'closed'">
      <button
        type="button"
        role="button"
        [id]="'accordion-' + zValue()"
        class="flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left border-none bg-transparent cursor-pointer focus:outline-none"
        [class]="class()"
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="'content-' + zValue()"
        tabindex="0"
      >
        <div class="flex-1">{{ zTitle() }}</div>
        <span class="transition-transform duration-200" [class.rotate-180]="isOpen()">
          <i class="icon-chevron-down !text-lg"></i>
        </span>
      </button>

      @if (isOpen()) {
        <div [id]="'content-' + zValue()" [attr.data-state]="isOpen() ? 'open' : 'closed'" role="region" [attr.aria-labelledby]="'accordion-' + zValue()">
          <div class="pb-4 pt-0">
            @if (zDescription()) {
              <p class="text-sm text-muted-foreground mb-2">{{ zDescription() }}</p>
            }
            <ng-content></ng-content>
          </div>
        </div>
      }
    </div>
  `,
})
export class ZardAccordionItemComponent {
  readonly zTitle = input<string>('');
  readonly zDescription = input<string>('');
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
