### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">combobox.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, forwardRef, HostListener, input, Output, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { ZardCommandEmptyComponent } from '../command/command-empty.component';
import { ZardCommandInputComponent } from '../command/command-input.component';
import { ZardCommandListComponent } from '../command/command-list.component';
import { ZardCommandOptionGroupComponent } from '../command/command-option-group.component';
import { ZardCommandOptionComponent } from '../command/command-option.component';
import { ZardCommandComponent, ZardCommandOption } from '../command/command.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover/popover.component';
import { comboboxVariants, ZardComboboxVariants } from './combobox.variants';

export interface ZardComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface ZardComboboxGroup {
  label?: string;
  options: ZardComboboxOption[];
}

@Component({
  selector: 'z-combobox',
  exportAs: 'zCombobox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ZardButtonComponent,
    ZardCommandComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandEmptyComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardPopoverDirective,
    ZardPopoverComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      z-button
      zPopover
      [zContent]="popoverContent"
      [zType]="buttonVariant()"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      role="combobox"
      [attr.aria-expanded]="open()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="'combobox-listbox'"
      [attr.aria-label]="ariaLabel() || 'Select option'"
      [attr.aria-describedby]="ariaDescribedBy()"
      (zVisibleChange)="setOpen($event)"
      #popoverTrigger
    >
      <span class="flex-1 text-left truncate">
        {{ displayValue() || placeholder() }}
      </span>
      <i [class]="iconClasses()"></i>
    </button>

    <ng-template #popoverContent>
      <z-popover [class]="popoverClasses()">
        <z-command (zOnSelect)="handleSelect($event)" #commandRef>
          @if (searchable()) {
            <z-command-input [placeholder]="searchPlaceholder()" #commandInputRef />
          }

          <z-command-list id="combobox-listbox" role="listbox">
            @if (emptyText()) {
              <z-command-empty>{{ emptyText() }}</z-command-empty>
            }

            @if (groups().length > 0) {
              @for (group of groups(); track group.label || $index) {
                @if (group.label) {
                  <z-command-option-group [zLabel]="group.label">
                    @for (option of group.options; track option.value) {
                      <z-command-option
                        [zValue]="option.value"
                        [zLabel]="option.label"
                        [zDisabled]="option.disabled || false"
                        [zIcon]="option.icon || ''"
                        [attr.aria-selected]="option.value === getCurrentValue()"
                      >
                        {{ option.label }}
                        @if (option.value === getCurrentValue()) {
                          <i class="icon-check ml-auto h-4 w-4"></i>
                        }
                      </z-command-option>
                    }
                  </z-command-option-group>
                } @else {
                  @for (option of group.options; track option.value) {
                    <z-command-option
                      [zValue]="option.value"
                      [zLabel]="option.label"
                      [zDisabled]="option.disabled || false"
                      [zIcon]="option.icon || ''"
                      [attr.aria-selected]="option.value === getCurrentValue()"
                    >
                      {{ option.label }}
                      @if (option.value === getCurrentValue()) {
                        <i class="icon-check ml-auto h-4 w-4"></i>
                      }
                    </z-command-option>
                  }
                }
              }
            } @else if (options().length > 0) {
              @for (option of options(); track option.value) {
                <z-command-option
                  [zValue]="option.value"
                  [zLabel]="option.label"
                  [zDisabled]="option.disabled || false"
                  [zIcon]="option.icon || ''"
                  [attr.aria-selected]="option.value === getCurrentValue()"
                >
                  {{ option.label }}
                  @if (option.value === getCurrentValue()) {
                    <i class="icon-check ml-auto h-4 w-4"></i>
                  }
                </z-command-option>
              }
            }
          </z-command-list>
        </z-command>
      </z-popover>
    </ng-template>
  `,
  host: {
    '[class]': 'classes()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardComboboxComponent),
      multi: true,
    },
  ],
})
export class ZardComboboxComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly buttonVariant = input<'default' | 'outline' | 'secondary' | 'ghost'>('outline');
  readonly zWidth = input<ZardComboboxVariants['zWidth']>('default');
  readonly placeholder = input<string>('Select...');
  readonly searchPlaceholder = input<string>('Search...');
  readonly emptyText = input<string>('No results found.');
  readonly disabled = input<boolean>(false);
  readonly searchable = input<boolean>(true);
  readonly value = input<string | null>(null);
  readonly options = input<ZardComboboxOption[]>([]);
  readonly groups = input<ZardComboboxGroup[]>([]);
  readonly ariaLabel = input<string>('');
  readonly ariaDescribedBy = input<string>('');

  @Output() readonly zValueChange = new EventEmitter<string | null>();
  @Output() readonly zOnSelect = new EventEmitter<ZardComboboxOption>();

  readonly popoverDirective = viewChild.required('popoverTrigger', { read: ZardPopoverDirective });
  readonly commandRef = viewChild('commandRef', { read: ZardCommandComponent });
  readonly commandInputRef = viewChild('commandInputRef', { read: ZardCommandInputComponent });

  protected readonly open = signal(false);
  protected readonly internalValue = signal<string | null>(null);

  protected readonly classes = computed(() =>
    mergeClasses(
      comboboxVariants({
        zWidth: this.zWidth(),
      }),
      this.class(),
    ),
  );

  protected readonly buttonClasses = computed(() => 'w-full justify-between');

  protected readonly iconClasses = computed(() => 'icon-chevrons-up-down ml-2 h-4 w-4 shrink-0 opacity-50');

  protected readonly popoverClasses = computed(() => {
    const widthClass = this.zWidth() === 'full' ? 'w-full' : 'w-[200px]';
    return `${widthClass} p-0`;
  });

  protected readonly getCurrentValue = computed(() => this.value() ?? this.internalValue());

  protected readonly displayValue = computed(() => {
    const currentValue = this.getCurrentValue();
    if (!currentValue) return null;

    // Search in groups first
    if (this.groups().length > 0) {
      for (const group of this.groups()) {
        const option = group.options.find(opt => opt.value === currentValue);
        if (option) return option.label;
      }
    }

    // Then search in flat options
    const option = this.options().find(opt => opt.value === currentValue);
    return option?.label || null;
  });

  private onChange: (value: string | null) => void = () => {
    // ControlValueAccessor implementation
  };
  private onTouched: () => void = () => {
    // ControlValueAccessor implementation
  };

  setOpen(open: boolean) {
    this.open.set(open);
    if (open) {
      // Focus will be handled by the effect after DOM updates
      setTimeout(() => {
        this.commandRef()?.focus();
      }, 0);
    }
  }

  handleSelect(commandOption: ZardCommandOption) {
    const selectedValue = commandOption.value as string;

    // Toggle behavior - if same value is selected, clear it
    const newValue = selectedValue === this.getCurrentValue() ? null : selectedValue;

    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.zValueChange.emit(newValue);

    // Emit the combobox option if we have a selection
    if (newValue) {
      let selectedOption: ZardComboboxOption | undefined;

      if (this.groups().length > 0) {
        for (const group of this.groups()) {
          selectedOption = group.options.find(opt => opt.value === newValue);
          if (selectedOption) break;
        }
      } else {
        selectedOption = this.options().find(opt => opt.value === newValue);
      }

      if (selectedOption) {
        this.zOnSelect.emit(selectedOption);
      }
    }

    // Close the popover
    this.popoverDirective().hide();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled()) return;
    // If popover is open, forward navigation keys to command component
    if (this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
        event.preventDefault();
        this.commandRef()?.onKeyDown(event);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        this.popoverDirective().hide();
        return;
      }
    } else {
      // Popover is closed - handle opening
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.popoverDirective().show();
        return;
      }
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // The disabled state is handled by the disabled input
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">combobox.variants.ts

```angular-ts showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva('', {
  variants: {
    zWidth: {
      default: 'w-[200px]',
      sm: 'w-[150px]',
      md: 'w-[250px]',
      lg: 'w-[350px]',
      full: 'w-full',
    },
  },
  defaultVariants: {
    zWidth: 'default',
  },
});

export type ZardComboboxVariants = VariantProps<typeof comboboxVariants>;
```

