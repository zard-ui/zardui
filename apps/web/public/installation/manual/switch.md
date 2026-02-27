

```angular-ts title="switch.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
        [disabled]="zDisabled() || formDisabled()"
        (click)="onSwitchChange()"
      >
        <span
          [attr.data-size]="zSize()"
          [attr.data-state]="status()"
          class="bg-background pointer-events-none block size-5 rounded-full shadow-lg ring-0 transition-transform data-[size=lg]:size-6 data-[size=sm]:size-4 data-[state=checked]:translate-x-5 data-[size=lg]:data-[state=checked]:translate-x-6 data-[size=sm]:data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[size=lg]:data-[state=unchecked]:translate-x-0 data-[size=sm]:data-[state=unchecked]:translate-x-0"
        ></span>
      </button>

      <label
        class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        [for]="zId() || z.id()"
      >
        <ng-content><span class="sr-only">toggle switch</span></ng-content>
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

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  protected readonly status = computed(() => (this.zChecked() ? 'checked' : 'unchecked'));
  protected readonly classes = computed(() =>
    mergeClasses(switchVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );

  protected readonly formDisabled = signal(false);

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
    if (this.zDisabled() || this.formDisabled()) {
      return;
    }

    this.zChecked.update(checked => !checked);
    this.onTouched();
    this.onChange(this.zChecked());
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}

```



```angular-ts title="switch.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

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

export type ZardSwitchSizeVariants = NonNullable<VariantProps<typeof switchVariants>['zSize']>;
export type ZardSwitchTypeVariants = NonNullable<VariantProps<typeof switchVariants>['zType']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './switch.component';
export * from './switch.variants';

```

