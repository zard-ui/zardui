### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">segmented.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  forwardRef,
  input,
  OnInit,
  output,
  QueryList,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { segmentedItemVariants, segmentedVariants, ZardSegmentedVariants } from './segmented.variants';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}
@Component({
  selector: 'z-segmented-item',
  standalone: true,
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
})
export class ZardSegmentedItemComponent {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
}

@Component({
  selector: 'z-segmented',
  exportAs: 'zSegmented',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()" role="tablist" [attr.aria-label]="zAriaLabel()">
      @if (zOptions().length > 0) {
        @for (option of zOptions(); track option.value) {
          <button
            type="button"
            role="tab"
            [class]="getItemClasses(option.value)"
            [disabled]="option.disabled || zDisabled()"
            [attr.aria-selected]="isSelected(option.value)"
            [attr.aria-controls]="option.value + '-panel'"
            [attr.id]="option.value + '-tab'"
            (click)="selectOption(option.value)"
          >
            {{ option.label }}
          </button>
        }
      } @else {
        @for (item of items(); track item.value()) {
          <button
            type="button"
            role="tab"
            [class]="getItemClasses(item.value())"
            [disabled]="item.disabled() || zDisabled()"
            [attr.aria-selected]="isSelected(item.value())"
            [attr.aria-controls]="item.value() + '-panel'"
            [attr.id]="item.value() + '-tab'"
            (click)="selectOption(item.value())"
          >
            {{ item.label() }}
          </button>
        }
      }
    </div>
  `,
  host: {
    '[class]': 'wrapperClasses()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSegmentedComponent),
      multi: true,
    },
  ],
})
export class ZardSegmentedComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  @ContentChildren(ZardSegmentedItemComponent)
  private readonly itemComponents!: QueryList<ZardSegmentedItemComponent>;

  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardSegmentedVariants['zSize']>('default');
  readonly zOptions = input<SegmentedOption[]>([]);
  readonly zDefaultValue = input<string>('');
  readonly zDisabled = input(false);
  readonly zAriaLabel = input<string>('Segmented control');

  readonly zChange = output<string>();

  protected readonly selectedValue = signal<string>('');
  protected readonly items = signal<ZardSegmentedItemComponent[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};

  ngOnInit() {
    // Initialize with default value
    if (this.zDefaultValue()) {
      this.selectedValue.set(this.zDefaultValue());
    }
  }

  ngAfterContentInit() {
    this.updateItems();
    this.itemComponents.changes.subscribe(() => {
      this.updateItems();
    });
  }

  private updateItems() {
    this.items.set(this.itemComponents.toArray());
  }

  protected readonly classes = computed(() => mergeClasses(segmentedVariants({ zSize: this.zSize() }), this.class()));

  protected readonly wrapperClasses = computed(() => 'inline-block');

  protected getItemClasses(value: string): string {
    return segmentedItemVariants({
      zSize: this.zSize(),
      isActive: this.isSelected(value),
    });
  }

  protected isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }

  protected selectOption(value: string) {
    if (this.zDisabled()) return;

    const option = this.zOptions().find(opt => opt.value === value);
    const item = this.items().find(item => item.value() === value);

    if ((option && option.disabled) || (item && item.disabled())) return;

    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.zChange.emit(value);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.selectedValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Handled by zDisabled input
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">segmented.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const segmentedVariants = cva('inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', {
  variants: {
    zSize: {
      sm: 'h-9 text-xs',
      default: 'h-10 text-sm',
      lg: 'h-12 text-base',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const segmentedItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      zSize: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
      isActive: {
        true: 'bg-background text-foreground shadow-sm',
        false: 'hover:bg-muted/50',
      },
    },
    defaultVariants: {
      zSize: 'default',
      isActive: false,
    },
  },
);

export type ZardSegmentedVariants = VariantProps<typeof segmentedVariants>;
export type ZardSegmentedItemVariants = VariantProps<typeof segmentedItemVariants>;

```

