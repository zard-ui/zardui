import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardSelectComponent } from './select.component';
import { selectItemVariants } from './select.variants';

@Component({
  selector: 'z-select-item, [z-select-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    '[class]': 'classes()',
    '[attr.value]': 'value()',
    role: 'option',
    tabindex: '-1',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
  },
  template: `
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      @if (isSelected()) {
        <i class="icon-check size-2 contents"></i>
      }
    </span>
    <ng-content></ng-content>
  `,
})
export class ZardSelectItemComponent {
  readonly value = input.required<string>();
  readonly disabled = input(false, { transform });
  readonly class = input<string>('');

  private select = inject(ZardSelectComponent, { optional: true });
  readonly elementRef = inject(ElementRef);

  protected readonly classes = computed(() => mergeClasses(selectItemVariants(), this.class()));

  protected readonly isSelected = computed(() => this.select?.selectedValue() === this.value());

  onClick() {
    if (this.disabled() || !this.select) return;

    const element = this.elementRef.nativeElement;
    const label = element.textContent?.trim() || element.innerText?.trim() || '';
    this.select.selectItem(this.value(), label);
  }
}
