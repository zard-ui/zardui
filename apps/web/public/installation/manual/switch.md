### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">switch.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassValue } from 'class-variance-authority/dist/types';

import { switchVariants, ZardSwitchVariants } from './switch.variants';
import { mergeClasses } from '../../shared/utils/utils';

type OnTouchedType = () => any;
type OnChangeType = (value: any) => void;

@Component({
  selector: 'z-switch, [z-switch]',
  standalone: true,
  exportAs: 'zSwitch',
  template: `
    <span class="flex items-center space-x-2" (mousedown)="onSwitchChange()">
      <button [id]="zId() || uniqueId()" type="button" role="switch" [attr.data-state]="status()" [attr.aria-checked]="checked()" [disabled]="disabled()" [class]="classes()">
        <span
          [attr.data-size]="zSize()"
          [attr.data-state]="status()"
          class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[size=sm]:w-4 data-[size=sm]:h-4 data-[size=sm]:data-[state=checked]:translate-x-4 data-[size=sm]:data-[state=unchecked]:translate-x-0 data-[size=lg]:w-6 data-[size=lg]:h-6 data-[size=lg]:data-[state=checked]:translate-x-6 data-[size=lg]:data-[state=unchecked]:translate-x-0"
        ></span>
      </button>

      <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" [for]="zId() || uniqueId()">
        <ng-content></ng-content>
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

  protected readonly classes = computed(() => mergeClasses(switchVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()));

  protected readonly uniqueId = signal<string>(`switch-${crypto.randomUUID()}`);
  protected checked = signal<boolean>(true);
  protected status = computed(() => (this.checked() ? 'checked' : 'unchecked'));
  protected disabled = signal(false);

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
    if (this.disabled()) return;

    this.checked.update(checked => !checked);
    this.onTouched();
    this.onChange(this.checked());
    this.checkChange.emit(this.checked());
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">switch.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input',
  {
    variants: {
      zType: {
        default: 'data-[state=checked]:bg-primary',
        destructive: 'data-[state=checked]:bg-destructive',
      },
      zSize: {
        default: 'h-6 w-11',
        sm: 'h-5 w-9',
        lg: 'h-7 w-13',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export type ZardSwitchVariants = VariantProps<typeof switchVariants>;

```

