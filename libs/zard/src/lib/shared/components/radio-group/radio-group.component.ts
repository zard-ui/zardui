import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
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

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

import { radioGroupVariants, radioVariants } from './radio-group.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: unknown) => void;

@Component({
  selector: 'z-radio-group, [z-radio-group]',
  template: '<ng-content />',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardRadioGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'radiogroup',
    'data-slot': 'radio-group',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
  exportAs: 'zRadioGroup',
})
export class ZardRadioGroupComponent implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly directionality = inject(Directionality, { optional: true });

  readonly class = input<ClassValue>('');
  readonly value = model<unknown>(null);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>('');

  protected readonly formDisabled = signal(false);
  protected readonly classes = computed(() => mergeClasses(radioGroupVariants(), this.class()));
  readonly isDisabled = computed(() => this.zDisabled() || this.formDisabled());

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  /**
   * Arrow keys move the selection. Down/Up always move to the next/previous radio; Right/Left follow the reading
   * direction, so in RTL ArrowLeft goes to the next radio and ArrowRight to the previous one.
   */
  protected onKeydown(event: KeyboardEvent): void {
    const rtl = this.directionality?.value === 'rtl';
    let step = 0;
    switch (event.key) {
      case 'ArrowDown':
        step = 1;
        break;
      case 'ArrowUp':
        step = -1;
        break;
      case 'ArrowRight':
        step = rtl ? -1 : 1;
        break;
      case 'ArrowLeft':
        step = rtl ? 1 : -1;
        break;
      default:
        return;
    }

    const radios = Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLButtonElement>('button[role="radio"]'),
    ).filter(radio => !radio.disabled);
    const current = radios.indexOf(event.target as HTMLButtonElement);
    if (current === -1 || radios.length === 0) {
      return;
    }

    event.preventDefault();
    const target = radios[(current + step + radios.length) % radios.length];
    target.focus();
    target.click();
  }

  select(value: unknown): void {
    if (this.isDisabled()) {
      return;
    }
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  isSelected(value: unknown): boolean {
    return this.value() === value;
  }

  writeValue(val: unknown): void {
    this.value.set(val);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}

@Component({
  selector: 'z-radio, [z-radio]',
  imports: [ZardIdDirective],
  template: `
    <button
      [id]="zId() || z.id()"
      type="button"
      role="radio"
      [attr.data-state]="checked() ? 'checked' : 'unchecked'"
      [attr.data-checked]="checked() ? '' : null"
      [attr.aria-checked]="checked()"
      [attr.aria-invalid]="zInvalid() ? 'true' : null"
      [class]="classes()"
      [disabled]="disabledState()"
      (click)="onSelect()"
      zardId="radio"
      #z="zardId"
    >
      @if (checked()) {
        <span data-slot="radio-group-indicator" class="flex size-4 items-center justify-center">
          <span class="bg-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full"></span>
        </span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zRadio',
})
export class ZardRadioComponent {
  private readonly group = inject(ZardRadioGroupComponent, { optional: true });

  readonly class = input<ClassValue>('');
  readonly value = input<unknown>(null);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zId = input<string>('');

  protected readonly checked = computed(() => this.group!.isSelected(this.value()));
  protected readonly disabledState = computed(() => this.zDisabled() || this.group!.isDisabled());
  protected readonly classes = computed(() => mergeClasses(radioVariants(), this.class()));

  constructor() {
    if (!this.group) {
      throw new Error('<z-radio> must be used inside a <z-radio-group>.');
    }
  }

  onSelect(): void {
    if (this.disabledState()) {
      return;
    }
    this.group!.select(this.value());
  }
}
