import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  EventEmitter,
  forwardRef,
  input,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ClassValue } from 'clsx';

import { commandVariants, type ZardCommandVariants } from './command.variants';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandInputComponent } from './command-input.component';
import { mergeClasses } from '../../shared/utils/utils';
import type { ZardIcon } from '../icon/icons';

export interface ZardCommandOption {
  value: unknown;
  label: string;
  disabled?: boolean;
  command?: string;
  shortcut?: string;
  icon?: ZardIcon;
  action?: () => void;
  key?: string; // Keyboard shortcut key (e.g., 'n' for Ctrl+N)
}

export interface ZardCommandGroup {
  label: string;
  options: ZardCommandOption[];
}

export interface ZardCommandConfig {
  placeholder?: string;
  emptyText?: string;
  groups: ZardCommandGroup[];
  dividers?: boolean;
  onSelect?: (option: ZardCommandOption) => void;
}

@Component({
  selector: 'z-command',
  exportAs: 'zCommand',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <div id="command-instructions" class="sr-only">Use arrow keys to navigate, Enter to select, Escape to clear selection.</div>
      <div id="command-status" class="sr-only" aria-live="polite" aria-atomic="true">
        {{ statusMessage() }}
      </div>
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[attr.role]': '"combobox"',
    '[attr.aria-expanded]': 'true',
    '[attr.aria-haspopup]': '"listbox"',
    '(keydown)': 'onKeyDown($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandComponent),
      multi: true,
    },
  ],
})
export class ZardCommandComponent implements ControlValueAccessor {
  readonly commandInput = contentChild(ZardCommandInputComponent);
  readonly optionComponents = contentChildren(ZardCommandOptionComponent, { descendants: true });

  readonly size = input<ZardCommandVariants['size']>('default');
  readonly class = input<ClassValue>('');

  @Output() readonly zOnChange = new EventEmitter<ZardCommandOption>();
  @Output() readonly zOnSelect = new EventEmitter<ZardCommandOption>();

  // Internal signals for search functionality
  readonly searchTerm = signal('');
  readonly selectedIndex = signal(-1);

  // Signal to trigger updates when optionComponents change
  private readonly optionsUpdateTrigger = signal(0);

  protected readonly classes = computed(() => mergeClasses(commandVariants({ size: this.size() }), this.class()));

  // Computed signal for filtered options - this will automatically update when searchTerm or options change
  readonly filteredOptions = computed(() => {
    const searchTerm = this.searchTerm();
    // Include the trigger signal to make this computed reactive to option changes
    this.optionsUpdateTrigger();

    if (!this.optionComponents()) return [];

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (lowerSearchTerm === '') return this.optionComponents();

    return this.optionComponents().filter(option => {
      const label = option.zLabel().toLowerCase();
      const command = option.zCommand()?.toLowerCase() ?? '';
      return label.includes(lowerSearchTerm) || command.includes(lowerSearchTerm);
    });
  });

  // Status message for screen readers
  protected readonly statusMessage = computed(() => {
    const searchTerm = this.searchTerm().trim();
    const filteredCount = this.filteredOptions().length;

    if (!searchTerm) return '';

    if (!filteredCount) {
      return `No results found for "${searchTerm}"`;
    }

    return `${filteredCount} result${filteredCount === 1 ? '' : 's'} found for "${searchTerm}"`;
  });

  private onChange = (_value: unknown) => {
    // ControlValueAccessor implementation
  };
  private onTouched = () => {
    // ControlValueAccessor implementation
  };

  constructor() {
    effect(() => {
      this.triggerOptionsUpdate();
    });
  }

  /**
   * Trigger an update to the filteredOptions computed signal
   */
  private triggerOptionsUpdate(): void {
    this.optionsUpdateTrigger.update(value => value + 1);
  }

  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.selectedIndex.set(-1);
    this.updateSelectedOption();
  }

  selectOption(option: ZardCommandOptionComponent) {
    const commandOption: ZardCommandOption = {
      value: option.zValue(),
      label: option.zLabel(),
      disabled: option.zDisabled(),
      command: option.zCommand(),
      shortcut: option.zShortcut(),
      icon: option.zIcon(),
    };

    this.onChange(commandOption.value);
    this.zOnChange.emit(commandOption);
    this.zOnSelect.emit(commandOption);
  }

  // in @Component host: '(keydown)': 'onKeyDown($event)'
  onKeyDown(event: KeyboardEvent) {
    const filteredOptions = this.filteredOptions();
    if (filteredOptions.length === 0) return;

    const currentIndex = this.selectedIndex();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
        this.selectedIndex.set(nextIndex);
        this.updateSelectedOption();
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
        this.selectedIndex.set(prevIndex);
        this.updateSelectedOption();
        break;
      }

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < filteredOptions.length) {
          const selectedOption = filteredOptions[currentIndex];
          if (!selectedOption.zDisabled()) {
            this.selectOption(selectedOption);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.selectedIndex.set(-1);
        this.updateSelectedOption();
        break;
    }
  }

  private updateSelectedOption() {
    const filteredOptions = this.filteredOptions();
    const selectedIndex = this.selectedIndex();

    // Clear previous selection
    for (const option of filteredOptions) {
      option.setSelected(false);
    }

    // Set new selection
    if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
      const selectedOption = filteredOptions[selectedIndex];
      selectedOption.setSelected(true);
      selectedOption.focus();
    }
  }

  // ControlValueAccessor implementation
  writeValue(_value: unknown): void {
    // Implementation if needed for form control integration
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Implementation if needed for form control disabled state
  }

  /**
   * Refresh the options list - useful when options are added/removed dynamically
   */
  refreshOptions(): void {
    this.triggerOptionsUpdate();
  }

  /**
   * Focus the command input
   */
  focus(): void {
    this.commandInput()?.focus();
  }
}
