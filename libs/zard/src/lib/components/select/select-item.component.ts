import { ChangeDetectionStrategy, Component, computed, ElementRef, forwardRef, inject, input, linkedSignal } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';
import { selectItemVariants } from './select.variants';

// Interface to avoid circular dependency
interface SelectHost {
  selectedValue(): string;
  selectItem(value: string, label: string): void;
}

@Component({
  selector: 'z-select-item, [z-select-item]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardIconComponent],
  host: {
    '[class]': 'classes()',
    '[attr.value]': 'zValue()',
    role: 'option',
    tabindex: '-1',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
  },
  template: `
    <span class="absolute right-2 flex size-3.5 items-center justify-center">
      @if (isSelected()) {
        <z-icon zType="check" />
      }
    </span>
    <ng-content></ng-content>
  `,
})
export class ZardSelectItemComponent {
  readonly zValue = input.required<string>();
  readonly zDisabled = input(false, { transform });
  readonly class = input<string>('');

  private select: SelectHost | null = null;
  readonly elementRef = inject(ElementRef);
  readonly label = linkedSignal(() => {
    const element = this.elementRef?.nativeElement;
    return (element?.textContent ?? element?.innerText)?.trim() ?? '';
  });

  protected readonly classes = computed(() => mergeClasses(selectItemVariants(), this.class()));

  protected readonly isSelected = computed(() => this.select?.selectedValue() === this.zValue());

  setSelectHost(selectHost: SelectHost) {
    this.select = selectHost;
  }

  onClick() {
    if (this.zDisabled() || !this.select) return;
    this.select.selectItem(this.zValue(), this.label());
  }
}
