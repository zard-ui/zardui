import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, inject, input, output, ViewEncapsulation } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ClassValue } from 'clsx';

import { checkboxLabelVariants, checkboxVariants, type ZardCheckboxVariants } from './checkbox.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

type OnTouchedType = () => any;
type OnChangeType = (value: any) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  standalone: true,
  imports: [ZardIconComponent],
  exportAs: 'zCheckbox',
  template: `
    <span
      tabindex="0"
      class="flex items-center gap-2"
      [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'"
      (click)="onCheckboxChange()"
      (keyup)="onKeyboardEvent($event)"
    >
      <main class="flex relative">
        <input #input type="checkbox" [class]="classes()" [checked]="checked" [disabled]="disabled()" (blur)="onCheckboxBlur()" name="checkbox" />
        <z-icon
          zType="check"
          [class]="
            'absolute flex items-center justify-center text-primary-foreground top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity ' +
            (checked ? 'opacity-100' : 'opacity-0')
          "
        />
      </main>
      <label [class]="labelClasses()" for="checkbox">
        <ng-content></ng-content>
      </label>
    </span>
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
})
export class ZardCheckboxComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  readonly checkChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });
  readonly zType = input<ZardCheckboxVariants['zType']>('default');
  readonly zSize = input<ZardCheckboxVariants['zSize']>('default');
  readonly zShape = input<ZardCheckboxVariants['zShape']>('default');
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(checkboxVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape() }), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(checkboxLabelVariants({ zSize: this.zSize() })));
  checked = false;

  writeValue(val: boolean): void {
    this.checked = val;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onCheckboxBlur(): void {
    this.onTouched();
    this.cdr.markForCheck();
  }

  onCheckboxChange(): void {
    if (this.disabled()) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkChange.emit(this.checked);
    this.cdr.markForCheck();
  }

  onKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onCheckboxChange();
    }
  }
}
