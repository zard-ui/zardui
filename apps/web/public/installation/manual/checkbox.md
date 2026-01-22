

```angular-ts title="checkbox.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import {
  checkboxLabelVariants,
  checkboxVariants,
  type ZardCheckboxShapeVariants,
  type ZardCheckboxSizeVariants,
  type ZardCheckboxTypeVariants,
} from './checkbox.variants';
import { ZardIconComponent } from '../icon/icon.component';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  imports: [ZardIconComponent, ZardIdDirective],
  template: `
    <main class="relative flex" zardId="checkbox" #z="zardId">
      <input
        #input
        type="checkbox"
        [id]="z.id()"
        [class]="classes()"
        [checked]="checked"
        [disabled]="disabled()"
        name="checkbox"
        tabindex="-1"
      />
      <z-icon
        zType="check"
        [class]="
          'text-primary-foreground pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-opacity ' +
          (checked ? 'opacity-100' : 'opacity-0')
        "
      />
    </main>
    <label [class]="labelClasses()" [for]="z.id()">
      <ng-content />
    </label>
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
  host: {
    tabindex: '0',
    '[class]': "(disabled() ? 'cursor-not-allowed' : 'cursor-pointer') + ' flex items-center gap-2'",
    '[attr.aria-disabled]': 'disabled()',
    '(blur)': 'onCheckboxBlur()',
    '(click)': 'onCheckboxChange()',
    '(keydown.{enter,space}.prevent)': 'onCheckboxChange()',
  },
  exportAs: 'zCheckbox',
})
export class ZardCheckboxComponent implements ControlValueAccessor {
  readonly checkChange = output<boolean>();

  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zType = input<ZardCheckboxTypeVariants>('default');
  readonly zSize = input<ZardCheckboxSizeVariants>('default');
  readonly zShape = input<ZardCheckboxShapeVariants>('default');

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  protected readonly classes = computed(() =>
    mergeClasses(checkboxVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()),
  );

  readonly disabledByForm = signal(false);
  protected readonly labelClasses = computed(() => mergeClasses(checkboxLabelVariants({ zSize: this.zSize() })));
  protected readonly disabled = computed(() => this.zDisabled() || this.disabledByForm());
  checked = false;

  writeValue(val: boolean): void {
    this.checked = val;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onCheckboxBlur(): void {
    this.onTouched();
  }

  onCheckboxChange(): void {
    if (this.disabled()) {
      return;
    }

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkChange.emit(this.checked);
  }
}

```



```angular-ts title="checkbox.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxVariants = cva(
  'cursor-[unset] peer appearance-none border transition shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zType: {
        default: 'border-primary checked:bg-primary',
        destructive: 'border-destructive checked:bg-destructive',
      },
      zSize: {
        default: 'size-4',
        lg: 'size-6',
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

export type ZardCheckboxShapeVariants = NonNullable<VariantProps<typeof checkboxVariants>['zShape']>;
export type ZardCheckboxSizeVariants = NonNullable<VariantProps<typeof checkboxVariants>['zSize']>;
export type ZardCheckboxTypeVariants = NonNullable<VariantProps<typeof checkboxVariants>['zType']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './checkbox.component';
export * from './checkbox.variants';

```

