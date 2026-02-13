

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
type OnChangeType = (value: string) => void;

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
  private readonly elementRef = inject(ElementRef);
  private onTouched: OnTouchedType = noopFn;
  private onChangeFn: OnChangeType = noopFn;

  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardInputSizeVariants>('default');
  readonly zStatus = input<ZardInputStatusVariants>();
  readonly value = model<string>('');

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
      const value = this.value();

      if (value !== undefined && value !== null) {
        this.elementRef.nativeElement.value = value;
      }
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  setDataSlot(name: string): void {
    if (this.elementRef?.nativeElement?.dataset) {
      this.elementRef.nativeElement.dataset.slot = name;
    }
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as HTMLInputElement | HTMLTextAreaElement | null;
    this.value.set(el?.value ?? '');
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

  writeValue(value?: string): void {
    const newValue = value ?? '';
    this.value.set(newValue);
    this.elementRef.nativeElement.value = newValue;
  }
}

```



```angular-ts title="input.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva('w-full', {
  variants: {
    zType: {
      default:
        'flex rounded-md border px-4 font-normal border-input bg-transparent file:border-0 file:text-foreground file:bg-transparent file:font-medium placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      textarea:
        'flex pb-2 min-h-20 h-auto rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    },
    zSize: {
      default: 'text-sm',
      sm: 'text-xs',
      lg: 'text-base',
    },
    zStatus: {
      error: 'border-destructive focus-visible:ring-destructive',
      warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      success: 'border-green-500 focus-visible:ring-green-500',
    },
    zBorderless: {
      true: 'flex-1 bg-transparent border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
  compoundVariants: [
    { zType: 'default', zSize: 'default', class: 'h-9 py-2 file:max-md:py-0' },
    { zType: 'default', zSize: 'sm', class: 'h-8 file:md:py-2 file:max-md:py-1.5' },
    { zType: 'default', zSize: 'lg', class: 'h-10 py-1 file:md:py-3 file:max-md:py-2.5' },
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

