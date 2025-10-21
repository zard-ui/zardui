import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, inject, input, output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ClassValue } from 'clsx';

import { radioLabelVariants, radioVariants, ZardRadioVariants } from './radio.variants';
import { generateId, mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';
import { Circle } from 'lucide-angular';

type OnTouchedType = () => unknown;
type OnChangeType = (value: unknown) => void;

@Component({
  selector: 'z-radio, [z-radio]',
  standalone: true,
  imports: [ZardIconComponent],
  exportAs: 'zRadio',
  template: `
    <span class="flex items-center gap-2" [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'" (mousedown)="onRadioChange()">
      <main class="flex relative">
        <input #input type="radio" [value]="value()" [class]="classes()" [checked]="checked" [disabled]="disabled()" (blur)="onRadioBlur()" [name]="name()" [id]="zId()" />
        <z-icon
          [zType]="CircleIcon"
          [zSize]="iconSize()"
          class="absolute flex items-center justify-center text-primary-foreground opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
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
  readonly CircleIcon = Circle;
  private cdr = inject(ChangeDetectorRef);

  readonly radioChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform });
  readonly zType = input<ZardRadioVariants['zType']>('default');
  readonly zSize = input<ZardRadioVariants['zSize']>('default');
  readonly name = input<string>('radio');
  readonly zId = input<string>(generateId('radio'));
  readonly value = input<unknown>(null);
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(radioVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(radioLabelVariants({ zSize: this.zSize() })));

  protected readonly iconSize = computed((): 'sm' | 'default' | 'lg' => {
    const size = this.zSize();
    if (size === 'lg') {
      return 'lg';
    }
    if (size === 'sm') {
      return 'sm';
    }
    return 'default';
  });

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
