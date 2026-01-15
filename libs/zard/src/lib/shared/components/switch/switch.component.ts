import {
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

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { switchVariants, type ZardSwitchVariants } from './switch.variants';

type OnTouchedType = () => any;
type OnChangeType = (value: any) => void;

@Component({
  selector: 'z-switch, [z-switch]',
  imports: [ZardIdDirective],
  template: `
    <span class="flex items-center space-x-2" (mousedown)="onSwitchChange()" zardId="switch" #z="zardId">
      <button
        [id]="zId() || z.id()"
        type="button"
        role="switch"
        [attr.data-state]="status()"
        [attr.aria-checked]="checked()"
        [disabled]="disabled()"
        [class]="classes()"
      >
        <span
          [attr.data-size]="zSize()"
          [attr.data-state]="status()"
          class="bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[size=lg]:h-6 data-[size=lg]:w-6 data-[size=sm]:h-4 data-[size=sm]:w-4 data-[state=checked]:translate-x-5 data-[size=lg]:data-[state=checked]:translate-x-6 data-[size=sm]:data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[size=lg]:data-[state=unchecked]:translate-x-0 data-[size=sm]:data-[state=unchecked]:translate-x-0"
        ></span>
      </button>

      <label
        class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        [for]="zId() || z.id()"
      >
        <ng-content />
      </label>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSwitch',
})
export class ZardSwitchComponent implements ControlValueAccessor {
  readonly checkChange = output<boolean>();
  readonly class = input<ClassValue>('');

  readonly zType = input<ZardSwitchVariants['zType']>('default');
  readonly zSize = input<ZardSwitchVariants['zSize']>('default');
  readonly zId = input<string>('');

  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() =>
    mergeClasses(switchVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );

  protected readonly checked = signal<boolean>(true);
  protected readonly status = computed(() => (this.checked() ? 'checked' : 'unchecked'));
  protected readonly disabled = signal(false);

  writeValue(val: boolean): void {
    this.checked.set(val);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onSwitchChange(): void {
    if (this.disabled()) {
      return;
    }

    this.checked.update(checked => !checked);
    this.onTouched();
    this.onChange(this.checked());
    this.checkChange.emit(this.checked());
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
