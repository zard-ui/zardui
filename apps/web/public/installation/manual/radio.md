### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">radio.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, input, output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassValue } from 'class-variance-authority/dist/types';
import { NgClass } from '@angular/common';

import { radioLabelVariants, radioVariants, ZardRadioVariants } from './radio.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

type OnTouchedType = () => unknown;
type OnChangeType = (value: unknown) => void;

@Component({
  selector: 'z-radio, [z-radio]',
  standalone: true,
  imports: [NgClass],
  exportAs: 'zRadio',
  template: `
    <span class="flex items-center gap-2" [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'" (mousedown)="onRadioChange()">
      <main class="flex relative">
        <input #input type="radio" [value]="value()" [class]="classes()" [checked]="checked" [disabled]="disabled()" (blur)="onRadioBlur()" [name]="name()" [id]="zId()" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          [ngClass]="svgSizeClass()"
          class="absolute flex items-center justify-center text-primary-foreground lucide lucide-circle opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </main>
      <label [class]="labelClasses()" [for]="zId()">
        <ng-content></ng-content>
      </label>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardRadioComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardRadioComponent implements ControlValueAccessor {
  readonly radioChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });
  readonly zType = input<ZardRadioVariants['zType']>('default');
  readonly zSize = input<ZardRadioVariants['zSize']>('default');
  readonly name = input<string>('radio');
  readonly zId = input<string>(`radio-${Math.random().toString(36).substring(2, 15)}`);
  readonly value = input<unknown>(null);
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(radioVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(radioLabelVariants({ zSize: this.zSize() })));

  protected readonly svgSizeClass = computed(() => {
    const size = this.zSize();
    if (size === 'lg') {
      return 'h-5 w-5';
    }
    if (size === 'sm') {
      return 'h-2.5 w-2.5';
    }
    return 'h-3.5 w-3.5'; // default size
  });

  checked = false;

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(val: unknown): void {
    this.checked = val === this.value();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onRadioBlur(): void {
    this.onTouched();
    this.cdr.markForCheck();
  }

  onRadioChange(): void {
    if (this.disabled()) return;

    this.checked = true;
    this.onChange(this.value());
    this.radioChange.emit(this.checked);
    this.cdr.markForCheck();
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">radio.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const radioVariants = cva(
  'cursor-[unset] peer appearance-none border transition shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zType: {
        default: 'border-primary checked:bg-primary',
        destructive: 'border-destructive checked:bg-destructive',
        secondary: 'border-secondary checked:bg-secondary',
      },
      zSize: {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-6 w-6',
      },
      zShape: {
        default: 'rounded-full',
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

export const radioLabelVariants = cva('cursor-[unset] text-current empty:hidden', {
  variants: {
    zSize: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardRadioVariants = VariantProps<typeof radioVariants>;
export type ZardRadioLabelVariants = VariantProps<typeof radioLabelVariants>;

```

