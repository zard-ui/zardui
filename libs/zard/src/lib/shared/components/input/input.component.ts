import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { inputGroupInputVariants, inputVariants } from './input.variants';

type OnTouchedType = () => void;
type ZardInputElement = HTMLInputElement | HTMLTextAreaElement;
type ZardInputValue = string | number | null | undefined;
type OnChangeType = (value: ZardInputValue) => void;

@Component({
  selector: 'input[z-input]',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': 'parentGroup ? "input-group-control" : "input"',
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
    '(blur)': 'onBlur()',
  },
  exportAs: 'zInput',
})
export class ZardInputComponent implements ControlValueAccessor {
  readonly parentGroup = inject(ZardInputGroupComponent, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  private onTouchedFn: OnTouchedType = noopFn;
  private onChangeFn: OnChangeType = noopFn;

  readonly class = input<ClassValue>('');
  readonly value = model<ZardInputValue>(null);

  protected readonly classes = computed(() =>
    mergeClasses(inputVariants(), this.parentGroup ? inputGroupInputVariants() : '', this.class()),
  );

  constructor() {
    effect(() => {
      this.writeNativeValue(this.value());
      const value = this.value();
      if (value !== undefined && value !== null) {
        this.elementRef.nativeElement.value = value;
      }
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as ZardInputElement | null;
    this.value.set(this.readNativeValue(el));
    this.onChangeFn(this.value());
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  writeValue(value?: string): void {
    this.value.set(value ?? '');
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
        if (element.value === '') {
          return null;
        }

        const numericValue = element.valueAsNumber;
        return Number.isNaN(numericValue) ? null : numericValue;
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
