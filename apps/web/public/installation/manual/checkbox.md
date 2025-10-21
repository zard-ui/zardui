

```angular-ts title="checkbox.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, inject, input, output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { checkboxLabelVariants, checkboxVariants, ZardCheckboxVariants } from './checkbox.variants';
import { ZardIconComponent } from '../icon/icon.component';

import type { ClassValue } from 'clsx';
import { Check } from 'lucide-angular';

type OnTouchedType = () => any;
type OnChangeType = (value: any) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  standalone: true,
  imports: [ZardIconComponent],
  exportAs: 'zCheckbox',
  template: `
    <span class="flex items-center gap-2" [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'" (click)="onCheckboxChange()">
      <main class="flex relative">
        <input #input type="checkbox" [class]="classes()" [checked]="checked" [disabled]="disabled()" (blur)="onCheckboxBlur()" name="checkbox" />
        <z-icon
          [zType]="CheckIcon"
          [class]="'absolute flex items-center justify-center text-primary-foreground top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity ' + (checked ? 'opacity-100' : 'opacity-0')"
        />
      </main>
      <label [class]="labelClasses()" for="checkbox">
        <ng-content></ng-content>
      </label>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardCheckboxComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  readonly CheckIcon = Check;

  readonly checkChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });
  readonly zType = input<ZardCheckboxVariants['zType']>('default');
  readonly zSize = input<ZardCheckboxVariants['zSize']>('default');
  readonly zShape = input<ZardCheckboxVariants['zShape']>('default');
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(checkboxVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(checkboxLabelVariants({ zSize: this.zSize() })));
  checked = false;

  writeValue(val: boolean): void {
    this.checked = val;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onCheckboxBlur(): void {
    this.onTouched();
    this.cdr.markForCheck();
  }

  onCheckboxChange(): void {
    if (this.disabled()) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkChange.emit(this.checked);
    this.cdr.markForCheck();
  }
}

```



```angular-ts title="checkbox.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const checkboxVariants = cva(
  'cursor-[unset] peer appearance-none border transition shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zType: {
        default: 'border-primary checked:bg-primary',
        destructive: 'border-destructive checked:bg-destructive',
      },
      zSize: {
        default: 'h-4 w-4',
        lg: 'h-6 w-6',
      },
      zShape: {
        default: 'rounded',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);

export const checkboxLabelVariants = cva('cursor-[unset] text-current empty:hidden', {
  variants: {
    zSize: {
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardCheckboxVariants = VariantProps<typeof checkboxVariants>;
export type ZardCheckLabelVariants = VariantProps<typeof checkboxLabelVariants>;

```

