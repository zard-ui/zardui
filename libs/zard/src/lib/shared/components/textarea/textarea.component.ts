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
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { textareaVariants, type ZardTextareaStatusVariants } from './textarea.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Directive({
  selector: 'textarea[z-textarea]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardTextareaDirective),
      multi: true,
    },
  ],
  host: {
    'data-slot': 'textarea',
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
    '(blur)': 'onBlur()',
  },
  exportAs: 'zTextarea',
})
export class ZardTextareaDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLTextAreaElement>);
  private onTouchedFn: OnTouchedType = noopFn;
  private onChangeFn: OnChangeType = noopFn;

  readonly class = input<ClassValue>('');
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zStatus = input<ZardTextareaStatusVariants>();
  readonly value = model<string>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      textareaVariants({
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

  getType(): 'textarea' {
    return 'textarea';
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as HTMLTextAreaElement | null;
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
  selector: 'z-textarea',
  imports: [ZardTextareaDirective],
  template: `
    <textarea
      z-textarea
      [attr.name]="zName() || null"
      [attr.placeholder]="zPlaceholder() || null"
      [attr.rows]="zRows()"
      [readonly]="zReadonly()"
      [disabled]="zDisabled() || formDisabled()"
      [attr.aria-invalid]="zInvalid() ? 'true' : null"
      [value]="value()"
      [class]="class()"
      [zBorderless]="zBorderless()"
      [zStatus]="zStatus()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    ></textarea>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardTextareaComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'textarea-wrapper',
    style: 'display: contents',
  },
  exportAs: 'zTextarea',
})
export class ZardTextareaComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly zName = input<string>('');
  readonly zPlaceholder = input<string>('');
  readonly zRows = input<number | null>(null);
  readonly zReadonly = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zStatus = input<ZardTextareaStatusVariants>();

  readonly value = model<string>('');
  protected readonly formDisabled = signal(false);

  private onChangeFn: OnChangeType = noopFn;
  private onTouchedFn: OnTouchedType = noopFn;

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
