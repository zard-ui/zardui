

```angular-ts title="combobox.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  input,
  Output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ClassValue } from 'clsx';

import { ZardCommandOptionGroupComponent } from '../command/command-option-group.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover/popover.component';
import { ZardCommandComponent, ZardCommandOption } from '../command/command.component';
import { ZardCommandOptionComponent } from '../command/command-option.component';
import { ZardCommandInputComponent } from '../command/command-input.component';
import { ZardCommandEmptyComponent } from '../command/command-empty.component';
import { ZardCommandListComponent } from '../command/command-list.component';
import { comboboxVariants, ZardComboboxVariants } from './combobox.variants';
import { ZardButtonComponent } from '../button/button.component';
import { ZardEmptyComponent } from '../empty/empty.component';
import { ZardIconComponent } from '../icon/icon.component';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardIcon } from '../icon/icons';

export interface ZardComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ZardIcon;
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
    ZardEmptyComponent,
    ZardIconComponent,
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
      [attr.aria-autocomplete]="searchable() ? 'list' : 'none'"
      [attr.aria-activedescendant]="null"
      (zVisibleChange)="setOpen($event)"
      #popoverTrigger
    >
      <span class="flex-1 text-left truncate">
        {{ displayValue() || placeholder() }}
      </span>
      <z-icon zType="chevrons-up-down" class="ml-2 shrink-0 opacity-50" />
    </button>

    <ng-template #popoverContent>
      <z-popover [class]="popoverClasses()">
        <z-command class="min-h-auto" (zOnSelect)="handleSelect($event)" #commandRef>
          @if (searchable()) {
            <z-command-input [placeholder]="searchPlaceholder()" #commandInputRef />
          }

          <z-command-list id="combobox-listbox" role="listbox">
            @if (emptyText()) {
              <z-command-empty>
                <z-empty [zDescription]="emptyText()" />
              </z-command-empty>
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
                        [zIcon]="option.icon"
                        [attr.aria-selected]="option.value === getCurrentValue()"
                      >
                        {{ option.label }}
                        @if (option.value === getCurrentValue()) {
                          <z-icon zType="check" class="ml-auto" />
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
                      [zIcon]="option.icon"
                      [attr.aria-selected]="option.value === getCurrentValue()"
                    >
                      {{ option.label }}
                      @if (option.value === getCurrentValue()) {
                        <z-icon zType="check" class="ml-auto" />
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
                  [zIcon]="option.icon"
                  [attr.aria-selected]="option.value === getCurrentValue()"
                >
                  {{ option.label }}
                  @if (option.value === getCurrentValue()) {
                    <z-icon zType="check" class="ml-auto" />
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
  readonly buttonRef = viewChild.required('popoverTrigger', { read: ElementRef });
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
      // Give time for the popover content to render and options to be detected
      setTimeout(() => {
        const commandRef = this.commandRef();
        if (commandRef) {
          // Refresh options to ensure they're detected
          commandRef.refreshOptions();
          // Focus on search input if searchable, otherwise on command component
          if (this.searchable()) {
            this.commandInputRef()?.focus();
          } else {
            commandRef.focus();
          }
        }
      }, 10);
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

    // Return focus to the combobox button after selection
    this.buttonRef().nativeElement.focus();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled()) return;

    // Handle different keyboard events based on combobox state
    if (this.open()) {
      // When popover is open
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          this.popoverDirective().hide();
          this.buttonRef().nativeElement.focus();
          break;

        case 'Tab':
          // Allow tab to close and move to next element
          this.popoverDirective().hide();
          break;

        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case 'Home':
        case 'End':
        case 'PageUp':
        case 'PageDown':
          // Forward navigation to command component
          event.preventDefault();
          this.commandRef()?.onKeyDown(event);
          break;
      }
    } else {
      // When popover is closed
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ': // Space key
          event.preventDefault();
          this.popoverDirective().show();
          break;

        case 'Escape':
          // Clear selection if there's a value
          if (this.getCurrentValue()) {
            event.preventDefault();
            this.internalValue.set(null);
            this.onChange(null);
            this.zValueChange.emit(null);
          }
          break;

        default:
          // For searchable comboboxes, open and start typing
          if (this.searchable() && event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            this.popoverDirective().show();
            // Let the command input handle the character after opening
            setTimeout(() => {
              const inputElement = this.commandInputRef();
              if (inputElement) {
                inputElement.focus();
                // Simulate the key press in the input
                const input = inputElement as unknown as {
                  searchInput?: { nativeElement: HTMLInputElement };
                  searchTerm: { set: (value: string) => void };
                  searchSubject: { next: (value: string) => void };
                };
                if (input.searchInput?.nativeElement) {
                  input.searchInput.nativeElement.value = event.key;
                  input.searchTerm.set(event.key);
                  input.searchSubject.next(event.key);
                }
              }
            }, 20);
          }
          break;
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    // Close on Escape from anywhere when this combobox is open
    if (this.open() && event.key === 'Escape') {
      const target = event.target as Element;
      const buttonElement = this.buttonRef().nativeElement;
      // Only handle if not already handled by the component itself
      if (!buttonElement.contains(target)) {
        this.popoverDirective().hide();
        this.buttonRef().nativeElement.focus();
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



```angular-ts title="combobox.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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

