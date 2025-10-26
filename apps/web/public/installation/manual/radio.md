

```angular-ts title="radio.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, inject, input, output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ClassValue } from 'clsx';

import { radioLabelVariants, radioVariants } from './radio.variants';
import { generateId, mergeClasses, transform } from '../../shared/utils/utils';

type OnTouchedType = () => unknown;
type OnChangeType = (value: unknown) => void;

@Component({
  selector: 'z-radio, [z-radio]',
  standalone: true,
  imports: [],
  exportAs: 'zRadio',
  template: `
    <span class="flex items-center gap-2 relative" [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'" (mousedown)="onRadioChange()">
      <input #input type="radio" [value]="value()" [class]="classes()" [checked]="checked" [disabled]="disabled()" (blur)="onRadioBlur()" [name]="name()" [id]="zId()" />
      <span class="absolute size-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 pointer-events-none left-[4px]"></span>
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
  private cdr = inject(ChangeDetectorRef);

  readonly radioChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });
  readonly name = input<string>('radio');
  readonly zId = input<string>(generateId('radio'));
  readonly value = input<unknown>(null);
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(radioVariants(), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(radioLabelVariants()));

  checked = false;

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

  setDisabledState(_isDisabled: boolean): void {
    // This is called by Angular forms when the disabled state changes
    // The input disabled() signal handles the state
    this.cdr.markForCheck();
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



```angular-ts title="radio.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva } from 'class-variance-authority';

export const radioVariants = cva(
  'cursor-[unset] peer appearance-none rounded-full border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 aspect-square shrink-0 size-4',
);

export const radioLabelVariants = cva('text-sm empty:hidden peer-disabled:opacity-50 peer-disabled:cursor-not-allowed');

```

