### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">toggle.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, forwardRef, HostListener, ViewEncapsulation, signal, computed, input, output, linkedSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassValue } from 'clsx';

import { toggleVariants, ZardToggleVariants } from './toggle.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-toggle',
  exportAs: 'zToggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      [attr.aria-label]="zAriaLabel()"
      [attr.aria-pressed]="value()"
      [attr.data-state]="value() ? 'on' : 'off'"
      [class]="classes()"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <ng-content></ng-content>
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleComponent),
      multi: true,
    },
  ],
})
export class ZardToggleComponent implements ControlValueAccessor {
  readonly zValue = input<boolean | undefined>();
  readonly zDefault = input<boolean>(false);
  readonly zDisabled = input(false, { alias: 'disabled', transform });
  readonly zType = input<ZardToggleVariants['zType']>('default');
  readonly zSize = input<ZardToggleVariants['zSize']>('md');
  readonly zAriaLabel = input<string>('', { alias: 'aria-label' });
  readonly class = input<ClassValue>('');

  readonly onClick = output<void>();
  readonly onHover = output<void>();
  readonly onChange = output<boolean>();

  private isUsingNgModel = signal(false);

  protected readonly value = linkedSignal(() => this.zValue() || this.zDefault());

  protected readonly disabled = linkedSignal(() => this.zDisabled());

  protected readonly classes = computed(() => mergeClasses(toggleVariants({ zSize: this.zSize(), zType: this.zType() }), this.class()));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  @HostListener('mouseenter')
  handleHover() {
    this.onHover.emit();
  }

  toggle() {
    if (this.disabled()) return;

    const next = !this.value();

    if (this.zValue() === undefined) {
      this.value.set(next);
    }

    this.onClick.emit();
    this.onChange.emit(next);
    this.onChangeFn(next);
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.value.set(val ?? this.zDefault());
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    this.isUsingNgModel.set(true);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">toggle.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      zType: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      zSize: {
        sm: 'h-8 px-2',
        md: 'h-9 px-3',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'md',
    },
  },
);
export type ZardToggleVariants = VariantProps<typeof toggleVariants>;

```

