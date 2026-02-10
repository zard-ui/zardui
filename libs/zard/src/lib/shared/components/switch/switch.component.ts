import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { switchVariants, type ZardSwitchSizeVariants, type ZardSwitchTypeVariants } from './switch.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-switch',
  imports: [ZardIdDirective],
  template: `
    <span class="flex items-center space-x-2" zardId="switch" #z="zardId">
      <button
        [id]="zId() || z.id()"
        type="button"
        role="switch"
        [attr.data-state]="status()"
        [attr.aria-checked]="zChecked()"
        [class]="classes()"
        [disabled]="zDisabled() || disabled()"
        (click)="onSwitchChange()"
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
        <ng-content><span class="sr-only" aria-label="toggle switch"></span></ng-content>
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
  readonly class = input<ClassValue>('');
  readonly zChecked = model<boolean>(true);
  readonly zId = input<string>('');
  readonly zSize = input<ZardSwitchSizeVariants>('default');
  readonly zType = input<ZardSwitchTypeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });

  private onChange: OnChangeType = () => noopFn;
  private onTouched: OnTouchedType = () => noopFn;

  protected readonly status = computed(() => (this.zChecked() ? 'checked' : 'unchecked'));
  protected readonly classes = computed(() =>
    mergeClasses(switchVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );

  protected readonly disabled = signal(false);

  writeValue(val: boolean): void {
    this.zChecked.set(val);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onSwitchChange(): void {
    if (this.zDisabled() || this.disabled()) {
      return;
    }

    this.zChecked.update(checked => !checked);
    this.onTouched();
    this.onChange(this.zChecked());
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
