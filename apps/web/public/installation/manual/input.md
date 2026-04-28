

```angular-ts title="input.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import {
  inputVariants,
  type ZardInputSizeVariants,
  type ZardInputStatusVariants,
  type ZardInputTypeVariants,
} from './input.variants';

type OnTouchedType = () => void;
type ZardInputElement = HTMLInputElement | HTMLTextAreaElement;
type ZardInputValue = string | number | null | undefined;
type OnChangeType = (value: ZardInputValue) => void;

@Directive({
  selector: 'input[z-input], textarea[z-input]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardInputDirective),
      multi: true,
    },
  ],
  host: {
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
    '(blur)': 'onBlur()',
  },
  exportAs: 'zInput',
})
export class ZardInputDirective implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<ZardInputElement>>(ElementRef);
  private onTouched: OnTouchedType = noopFn;
  private onChangeFn: OnChangeType = noopFn;

  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardInputSizeVariants>('default');
  readonly zStatus = input<ZardInputStatusVariants>();
  readonly value = model<ZardInputValue>(null);

  readonly size = linkedSignal<ZardInputSizeVariants>(() => this.zSize());

  protected readonly classes = computed(() =>
    mergeClasses(
      inputVariants({
        zType: this.getType(),
        zSize: this.size(),
        zStatus: this.zStatus(),
        zBorderless: this.zBorderless(),
      }),
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.writeNativeValue(this.value());
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  setDataSlot(name: string): void {
    if (this.elementRef?.nativeElement?.dataset) {
      this.elementRef.nativeElement.dataset['slot'] = name;
    }
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as ZardInputElement | null;
    this.value.set(this.readNativeValue(el));
    this.onChangeFn(this.value());
  }

  protected onBlur() {
    this.onTouched();
  }

  getType(): ZardInputTypeVariants {
    const isTextarea = this.elementRef.nativeElement.tagName.toLowerCase() === 'textarea';
    return isTextarea ? 'textarea' : 'default';
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable(isDisabled);
  }

  writeValue(value: ZardInputValue): void {
    const newValue = value ?? '';
    this.value.set(newValue);
  }

  private isNumericInput(element: ZardInputElement): element is HTMLInputElement {
    return element.tagName.toLowerCase() === 'input' && ['number', 'range'].includes(element.type);
  }

  private readNativeValue(element: ZardInputElement | null): ZardInputValue {
    if (!element) {
      return '';
    }

    if (this.isNumericInput(element)) {
      const currentValue = this.value();

      if (typeof currentValue === 'number' || currentValue === null) {
        return element.value === '' ? null : element.valueAsNumber;
      }
    }

    return element.value;
  }

  private writeNativeValue(value: ZardInputValue): void {
    const element = this.elementRef.nativeElement;

    if (this.isNumericInput(element) && typeof value === 'number') {
      element.value = Number.isNaN(value) ? '' : String(value);
      return;
    }

    element.value = String(value ?? '');
  }
}

```



```angular-ts title="input.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva('w-full min-w-0', {
  variants: {
    zType: {
      default:
        'flex rounded-lg border border-input bg-transparent px-2.5 font-normal transition-colors file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80',
      textarea:
        'flex pb-2 min-h-20 h-auto rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80',
    },
    zSize: {
      default: 'text-base md:text-sm',
      sm: 'text-base md:text-sm',
      lg: 'text-base',
    },
    zStatus: {
      error: 'border-destructive focus-visible:ring-destructive',
      warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      success: 'border-green-500 focus-visible:ring-green-500',
    },
    zBorderless: {
      true: 'flex-1 bg-transparent border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
  compoundVariants: [
    { zType: 'default', zSize: 'default', class: 'h-9 py-1 file:h-7 file:text-sm file:max-md:py-0' },
    { zType: 'default', zSize: 'sm', class: 'h-8 py-1 file:h-6 file:text-sm file:max-md:py-1.5' },
    { zType: 'default', zSize: 'lg', class: 'h-10 py-1 file:h-7 file:text-sm file:max-md:py-2.5' },
  ],
});

export type ZardInputTypeVariants = NonNullable<VariantProps<typeof inputVariants>['zType']>;
export type ZardInputSizeVariants = NonNullable<VariantProps<typeof inputVariants>['zSize']>;
export type ZardInputStatusVariants = NonNullable<VariantProps<typeof inputVariants>['zStatus']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './input.directive';
export * from './input.variants';

```

