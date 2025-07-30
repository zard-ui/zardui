import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardSelectComponent } from './select.component';
import { selectItemVariants } from './select.variants';

@Component({
  selector: 'z-select-item, [z-select-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  host: {
    '[class]': 'classes()',
    role: 'option',
    tabindex: '-1',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
  },
  template: `
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      <svg
        *ngIf="isSelected()"
        class="size-4"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m9 12 2 2 4-4" />
      </svg>
    </span>
    <ng-content></ng-content>
  `,
})
export class ZardSelectItemComponent {
  readonly value = input.required<string>();
  readonly disabled = input(false, { transform });
  readonly class = input<string>('');

  private select = inject(ZardSelectComponent, { optional: true });
  private elementRef = inject(ElementRef);

  protected readonly classes = computed(() => mergeClasses(selectItemVariants(), this.class()));

  protected readonly isSelected = computed(() => this.select?.selectedValue() === this.value());

  onClick() {
    if (this.disabled() || !this.select) return;

    const label = this.elementRef.nativeElement.textContent?.trim() || '';
    this.select.selectItem(this.value(), label);
  }
}
