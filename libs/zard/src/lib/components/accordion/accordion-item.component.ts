import { ClassValue } from 'class-variance-authority/dist/types';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';
import { mergeClasses } from '../../shared/utils/utils';
import { accordionItemVariants, accordionItemContentVariants, accordionItemTriggerVariants } from './accordion.variants';
import { ZardAccordionComponent } from './accordion.component';

@Component({
  selector: 'z-accordion-item',
  exportAs: 'zAccordionItem',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()" [attr.data-state]="isOpen() ? 'open' : 'closed'">
      <button
        type="button"
        role="button"
        [id]="'header-' + zValue()"
        [class]="triggerClasses()"
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
        <div [id]="'content-' + zValue()" [class]="contentClasses()" [attr.data-state]="isOpen() ? 'open' : 'closed'" role="region" [attr.aria-labelledby]="'header-' + zValue()">
          <div class="p-4">
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

  protected readonly classes = computed(() => mergeClasses(accordionItemVariants(), this.class()));
  protected readonly triggerClasses = computed(() => mergeClasses(accordionItemTriggerVariants()));
  protected readonly contentClasses = computed(() => mergeClasses(accordionItemContentVariants()));
}
