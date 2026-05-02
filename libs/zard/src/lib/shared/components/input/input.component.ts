import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { inputVariants, type ZardInputSizeVariants, type ZardInputStatusVariants } from './input.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Directive({
  selector: 'input[z-input]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardInputDirective),
      multi: true,
    },
  ],
  host: {
    'data-slot': 'input',
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
    '(blur)': 'onBlur()',
  },
  exportAs: 'zInput',
})
export class ZardInputDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private onTouchedFn: OnTouchedType = noopFn;
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

  setDataSlot(name: string): void {
    if (this.elementRef?.nativeElement?.dataset) {
      this.elementRef.nativeElement.dataset.slot = name;
    }
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  getType(): 'default' {
    return 'default';
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as HTMLInputElement | null;
    this.value.set(el?.value ?? '');
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
}

@Component({
  selector: 'z-input',
  imports: [ZardInputDirective],
  template: `
    <input
      z-input
      [type]="zType()"
      [attr.name]="zName() || null"
      [attr.placeholder]="zPlaceholder() || null"
      [readonly]="zReadonly()"
      [disabled]="zDisabled() || formDisabled()"
      [attr.aria-invalid]="zInvalid() ? 'true' : null"
      [value]="value()"
      [class]="class()"
      [zBorderless]="zBorderless()"
      [zSize]="zSize()"
      [zStatus]="zStatus()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
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
    'data-slot': 'input-wrapper',
    style: 'display: contents',
  },
  exportAs: 'zInput',
})
export class ZardInputComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly zType = input<string>('text');
  readonly zName = input<string>('');
  readonly zPlaceholder = input<string>('');
  readonly zReadonly = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardInputSizeVariants>('default');
  readonly zStatus = input<ZardInputStatusVariants>();

  readonly value = model<string>('');
  protected readonly formDisabled = signal(false);

  private onChangeFn: OnChangeType = noopFn;
  private onTouchedFn: OnTouchedType = noopFn;

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChangeFn(target.value);
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  writeValue(value?: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
