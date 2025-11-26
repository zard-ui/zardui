import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';

import { mergeClasses, transform } from '@ngzard/ui/core';
import { ZardIconComponent } from '@ngzard/ui/icon';

import { selectItemVariants } from './select.variants';

// Interface to avoid circular dependency
interface SelectHost {
  selectedValue(): string[];
  selectItem(value: string, label: string): void;
}

@Component({
  selector: 'z-select-item, [z-select-item]',
  imports: [ZardIconComponent],
  template: `
    @if (isSelected()) {
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        <z-icon zType="check" />
      </span>
    }
    <span class="truncate">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
})
export class ZardSelectItemComponent {
  readonly zValue = input.required<string>();
  readonly zDisabled = input(false, { transform });
  readonly class = input<string>('');

  private readonly select = signal<SelectHost | null>(null);
  readonly elementRef = inject(ElementRef);
  readonly label = linkedSignal<string>(() => {
    const element = this.elementRef?.nativeElement;
    return (element?.textContent ?? element?.innerText)?.trim() ?? '';
  });

  protected readonly classes = computed(() => mergeClasses(selectItemVariants(), this.class()));
  protected readonly isSelected = computed(() => this.select()?.selectedValue().includes(this.zValue()));

  setSelectHost(selectHost: SelectHost) {
    this.select.set(selectHost);
  }

  onClick() {
    if (this.zDisabled()) return;
    this.select()?.selectItem(this.zValue(), this.label());
  }
}
