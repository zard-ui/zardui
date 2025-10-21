

```angular-ts title="toggle-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { toggleGroupVariants, toggleGroupItemVariants } from './toggle-group.variants';
import { ZardIconComponent } from '../icon/icon.component';
import { LucideIconData } from 'lucide-angular';

export interface ZardToggleGroupItem {
  value: string;
  label?: string;
  icon?: LucideIconData;
  disabled?: boolean;
  ariaLabel?: string;
}

type OnTouchedType = () => void;
type OnChangeType = (value: string | string[]) => void;

@Component({
  selector: 'z-toggle-group',
  exportAs: 'zToggleGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardIconComponent],
  template: `
    <div [class]="classes()" role="group" [attr.data-orientation]="'horizontal'">
      @for (item of items(); track item.value; let i = $index) {
        <button
          type="button"
          [attr.aria-pressed]="isItemPressed(item.value)"
          [attr.data-state]="isItemPressed(item.value) ? 'on' : 'off'"
          [attr.aria-label]="item.ariaLabel"
          [class]="getItemClasses(i, items().length)"
          [disabled]="disabled() || item.disabled"
          (click)="toggleItem(item)"
        >
          @if (item.icon) {
            <span z-icon [zType]="item.icon" class="w-4 h-4 shrink-0"></span>
          }
          @if (item.label) {
            <span>{{ item.label }}</span>
          } @else if (!item.icon) {
            <span>{{ item.value }}</span>
          }
        </button>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleGroupComponent),
      multi: true,
    },
  ],
})
export class ZardToggleGroupComponent implements ControlValueAccessor {
  readonly zMode = input<'single' | 'multiple'>('multiple');
  readonly zType = input<'default' | 'outline'>('default');
  readonly zSize = input<'sm' | 'md' | 'lg'>('md');
  readonly value = input<string | string[]>();
  readonly defaultValue = input<string | string[]>();
  readonly disabled = input<boolean>(false);
  readonly class = input<ClassValue>('');
  readonly items = input<ZardToggleGroupItem[]>([]);

  readonly valueChange = output<string | string[]>();

  private internalValue = signal<string | string[] | undefined>(undefined);

  protected readonly classes = computed(() =>
    mergeClasses(
      toggleGroupVariants({
        zType: this.zType(),
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );

  protected readonly currentValue = computed(() => {
    const internal = this.internalValue();
    const input = this.value();
    const defaultVal = this.defaultValue();

    if (internal !== undefined) return internal;
    if (input !== undefined) return input;
    if (defaultVal !== undefined) return defaultVal;

    return this.zMode() === 'single' ? '' : [];
  });

  protected getItemClasses(index: number, total: number): string {
    const baseClasses = toggleGroupItemVariants({
      zType: this.zType(),
      zSize: this.zSize(),
    });

    const positionClasses = [];

    // Add rounded corners for first and last items
    if (index === 0) {
      positionClasses.push('first:rounded-l-md');
    }
    if (index === total - 1) {
      positionClasses.push('last:rounded-r-md');
    }

    // Handle borders for outline variant
    if (this.zType() === 'outline') {
      if (index === 0) {
        // First item gets full border
        positionClasses.push('border-l');
      } else {
        // Other items don't get left border (connects to previous)
        positionClasses.push('border-l-0');
      }
    }

    // Focus z-index
    positionClasses.push('focus:z-10', 'focus-visible:z-10');

    return mergeClasses(baseClasses, ...positionClasses);
  }

  protected isItemPressed(itemValue: string): boolean {
    const current = this.currentValue();
    if (this.zMode() === 'single') {
      return current === itemValue;
    }
    return Array.isArray(current) && current.includes(itemValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  toggleItem(item: ZardToggleGroupItem) {
    if (this.disabled() || item.disabled) return;

    const currentValue = this.currentValue();
    let newValue: string | string[];

    if (this.zMode() === 'single') {
      newValue = currentValue === item.value ? '' : item.value;
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(item.value)) {
        newValue = currentArray.filter(v => v !== item.value);
      } else {
        newValue = [...currentArray, item.value];
      }
    }

    this.internalValue.set(newValue);
    this.valueChange.emit(newValue);
    this.onChangeFn(newValue);
    this.onTouched();
  }

  writeValue(value: string | string[]): void {
    if (value !== undefined) {
      this.internalValue.set(value);
    }
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // Note: disabled state is handled through the disabled input
    // This method is required by ControlValueAccessor interface
  }
}

```



```angular-ts title="toggle-group.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const toggleGroupVariants = cva('flex w-fit items-center rounded-md', {
  variants: {
    zType: {
      default: '',
      outline: 'shadow-sm',
    },
    zSize: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'md',
  },
});

export const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-none gap-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      zType: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      zSize: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-sm',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'md',
    },
  },
);

export type ZardToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;
export type ZardToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;

```

