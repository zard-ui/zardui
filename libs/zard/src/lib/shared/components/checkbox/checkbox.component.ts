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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { checkboxLabelVariants, checkboxVariants } from './checkbox.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  imports: [NgIcon, ZardIdDirective],
  template: `
    <span class="relative flex" zardId="checkbox" #z="zardId">
      <input
        #input
        type="checkbox"
        name="checkbox"
        [id]="zId() || z.id()"
        [class]="classes()"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.data-state]="checked() ? 'checked' : 'unchecked'"
        [attr.data-checked]="checked() ? '' : null"
        [attr.aria-invalid]="zInvalid() ? 'true' : null"
        (blur)="onCheckboxBlur()"
        (click)="onCheckboxChange()"
      />
      <ng-icon
        name="lucideCheck"
        class="text-primary-foreground pointer-events-none absolute top-1/2 left-1/2 flex -translate-1/2 items-center justify-center transition-opacity"
        [class]="checked() ? 'opacity-100' : 'opacity-0'"
      />
    </span>
    <label [class]="labelClasses()" [for]="zId() || z.id()">
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
  viewProviders: [provideIcons({ lucideCheck })],
  host: {
    'data-slot': 'checkbox',
    '[class]': "(disabled() ? 'cursor-not-allowed' : 'cursor-pointer') + ' flex items-center gap-2'",
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-invalid]': 'zInvalid() ? "true" : null',
    '[attr.data-checked]': "checked() ? '' : null",
    '[attr.data-state]': "checked() ? 'checked' : 'unchecked'",
  },
  exportAs: 'zCheckbox',
})
export class ZardCheckboxComponent implements ControlValueAccessor {
  readonly checkChange = output<boolean>();

  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zId = input<string>('');

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  protected readonly classes = computed(() => mergeClasses(checkboxVariants(), this.class()));

  readonly disabledByForm = signal(false);
  protected readonly labelClasses = computed(() => mergeClasses(checkboxLabelVariants()));
  protected readonly disabled = computed(() => this.zDisabled() || this.disabledByForm());
  readonly checked = signal(false);

  writeValue(val: boolean): void {
    this.checked.set(val);
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

    this.checked.update(v => !v);
    this.onChange(this.checked());
    this.checkChange.emit(this.checked());
  }
}
