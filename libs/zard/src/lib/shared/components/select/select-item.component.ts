import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  selectItemIconVariants,
  selectItemStateVariants,
  selectItemVariants,
  type ZardSelectItemModeVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

// Interface to avoid circular dependency
interface SelectHost {
  selectedValue(): string[];
  selectItem(value: string, label: string): void;
  navigateTo(): void;
}

@Component({
  selector: 'z-select-item, [z-select-item]',
  imports: [NgIcon],
  template: `
    <span data-slot="select-item-indicator" [class]="iconClasses()">
      @if (isSelected()) {
        <ng-icon
          name="lucideCheck"
          class="size-4! text-current"
          [strokeWidth]="strokeWidth()"
          aria-hidden="true"
          data-testid="check-icon"
        />
      }
    </span>
    <span data-slot="select-item-text" class="truncate">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck })],
  host: {
    role: 'option',
    tabindex: '-1',
    'data-slot': 'select-item',
    '[class]': 'classes()',
    '[attr.value]': 'zValue()',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-disabled]': 'zDisabled()',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(keydown.{tab}.prevent)': 'noopFn',
  },
})
export class ZardSelectItemComponent {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly zValue = input.required<string>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  private readonly select = signal<SelectHost | null>(null);
  noopFn = noopFn;

  readonly label = linkedSignal<string>(() => {
    const element = this.elementRef.nativeElement;
    return (element.textContent ?? element.innerText)?.trim() ?? '';
  });

  readonly zMode = signal<ZardSelectItemModeVariants>('normal');

  protected readonly classes = computed(() =>
    mergeClasses(selectItemVariants({ zMode: this.zMode() }), selectItemStateVariants(), this.class()),
  );

  protected readonly iconClasses = computed(() => mergeClasses(selectItemIconVariants({ zMode: this.zMode() })));

  protected readonly strokeWidth = computed(() => (this.zMode() === 'compact' ? 3 : 2));

  protected readonly isSelected = computed(() => this.select()?.selectedValue().includes(this.zValue()) ?? false);

  setSelectHost(selectHost: SelectHost) {
    this.select.set(selectHost);
  }

  onMouseEnter() {
    if (this.zDisabled()) {
      return;
    }
    this.select()?.navigateTo();
  }

  onClick() {
    if (this.zDisabled()) {
      return;
    }
    this.select()?.selectItem(this.zValue(), this.label());
  }
}
