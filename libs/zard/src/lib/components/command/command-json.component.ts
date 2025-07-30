import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, EventEmitter, forwardRef, HostListener, input, Output, signal, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandDividerComponent } from './command-divider.component';
import { ZardCommandEmptyComponent } from './command-empty.component';
import { ZardCommandInputComponent } from './command-input.component';
import { ZardCommandListComponent } from './command-list.component';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandConfig, ZardCommandOption } from './command.component';
import { commandVariants, ZardCommandVariants } from './command.variants';

@Component({
  selector: 'z-command-json',
  exportAs: 'zCommandJson',
  standalone: true,
  imports: [
    FormsModule,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandEmptyComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardCommandDividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <div id="command-instructions" class="sr-only">Use arrow keys to navigate, Enter to select, Escape to clear selection.</div>
      <div id="command-status" class="sr-only" aria-live="polite" aria-atomic="true">
        {{ statusMessage() }}
      </div>
      <z-command-input [placeholder]="config().placeholder || 'Type a command or search...'" (input)="onSearch($any($event.target).value)"> </z-command-input>
      <z-command-list>
        <z-command-empty>{{ config().emptyText || 'No results found.' }}</z-command-empty>

        @for (group of filteredGroups(); track group.label; let groupIndex = $index) {
          <z-command-option-group [zLabel]="group.label">
            @for (option of group.visibleOptions; track option.value; let optionIndex = $index) {
              <z-command-option
                [zLabel]="option.label"
                [zValue]="option.value"
                [zIcon]="option.icon || ''"
                [zShortcut]="option.shortcut || ''"
                [zCommand]="option.command || ''"
                [zDisabled]="option.disabled || false"
                [class]="getOptionClasses(groupIndex, optionIndex)"
                (click)="onOptionClick(option)"
              >
              </z-command-option>
            }
          </z-command-option-group>

          @if (config().dividers !== false && shouldShowDivider(groupIndex)) {
            <z-command-divider></z-command-divider>
          }
        }
      </z-command-list>
    </div>
  `,
  host: {
    '[attr.role]': '"combobox"',
    '[attr.aria-expanded]': 'true',
    '[attr.aria-haspopup]': '"listbox"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandJsonComponent),
      multi: true,
    },
  ],
})
export class ZardCommandJsonComponent implements ControlValueAccessor {
  readonly config = input.required<ZardCommandConfig>();
  readonly size = input<ZardCommandVariants['size']>('default');
  readonly class = input<ClassValue>('');

  @Output() readonly zOnChange = new EventEmitter<ZardCommandOption>();
  @Output() readonly zOnSelect = new EventEmitter<ZardCommandOption>();

  // Search functionality
  readonly searchTerm = signal('');
  readonly selectedIndex = signal(-1);

  protected readonly classes = computed(() => mergeClasses(commandVariants({ size: this.size() }), this.class()));

  // Computed filtered groups based on search term
  readonly filteredGroups = computed(() => {
    const searchTerm = this.searchTerm().toLowerCase();
    const groups = this.config().groups;

    if (searchTerm === '') {
      return groups.map((group, index) => ({
        label: group.label,
        visibleOptions: group.options,
        originalIndex: index,
      }));
    }

    return groups
      .map((group, index) => ({
        label: group.label,
        visibleOptions: group.options.filter(option => {
          const label = option.label.toLowerCase();
          const command = option.command?.toLowerCase() || '';
          const value = String(option.value).toLowerCase();
          return label.includes(searchTerm) || command.includes(searchTerm) || value.includes(searchTerm);
        }),
        originalIndex: index,
      }))
      .filter(group => group.visibleOptions.length > 0);
  });

  // Status message for screen readers
  protected readonly statusMessage = computed(() => {
    const searchTerm = this.searchTerm();
    const filteredGroups = this.filteredGroups();
    const totalOptions = filteredGroups.reduce((acc, group) => acc + group.visibleOptions.length, 0);

    if (searchTerm === '') return '';

    if (totalOptions === 0) {
      return `No results found for "${searchTerm}"`;
    }

    return `${totalOptions} result${totalOptions === 1 ? '' : 's'} found for "${searchTerm}"`;
  });

  private onChange = (_value: unknown) => {
    // ControlValueAccessor implementation
  };
  private onTouched = () => {
    // ControlValueAccessor implementation
  };

  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.selectedIndex.set(-1); // Reset selection when searching
  }

  shouldShowDivider(currentIndex: number): boolean {
    const filteredGroups = this.filteredGroups();
    return currentIndex < filteredGroups.length - 1;
  }

  onOptionClick(option: ZardCommandOption) {
    if (option.disabled) return;

    // Execute option's action if defined
    if (option.action) {
      option.action();
    }

    // Execute global onSelect callback if defined
    const onSelect = this.config().onSelect;
    if (onSelect) {
      onSelect(option);
    }

    this.onChange(option.value);
    this.zOnChange.emit(option);
    this.zOnSelect.emit(option);
  }

  // Handle keyboard navigation and shortcuts
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    // Handle global shortcuts (Ctrl/Cmd + key)
    if (event.metaKey || event.ctrlKey) {
      const matchingOption = this.findOptionByKey(event.key.toLowerCase());
      if (matchingOption) {
        event.preventDefault();
        this.onOptionClick(matchingOption);
        return;
      }
    }

    // Handle keyboard navigation
    const flatOptions = this.getFlatOptions();
    const currentIndex = this.selectedIndex();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < flatOptions.length - 1 ? currentIndex + 1 : 0;
        this.selectedIndex.set(nextIndex);
        this.scrollToSelectedOption();
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : flatOptions.length - 1;
        this.selectedIndex.set(prevIndex);
        this.scrollToSelectedOption();
        break;
      }

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < flatOptions.length) {
          const selectedOption = flatOptions[currentIndex];
          if (!selectedOption.disabled) {
            this.onOptionClick(selectedOption);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.selectedIndex.set(-1);
        break;
    }
  }

  private findOptionByKey(key: string): ZardCommandOption | undefined {
    for (const group of this.config().groups) {
      const option = group.options.find(opt => opt.key?.toLowerCase() === key);
      if (option) return option;
    }
    return undefined;
  }

  private getFlatOptions(): ZardCommandOption[] {
    const filteredGroups = this.filteredGroups();
    const flatOptions: ZardCommandOption[] = [];

    filteredGroups.forEach(group => {
      flatOptions.push(...group.visibleOptions);
    });

    return flatOptions;
  }

  getOptionClasses(groupIndex: number, optionIndex: number): string {
    const flatIndex = this.getFlatOptionIndex(groupIndex, optionIndex);
    const isSelected = flatIndex === this.selectedIndex();
    return isSelected ? 'bg-accent text-accent-foreground' : '';
  }

  private getFlatOptionIndex(groupIndex: number, optionIndex: number): number {
    const filteredGroups = this.filteredGroups();
    let flatIndex = 0;

    for (let i = 0; i < groupIndex; i++) {
      flatIndex += filteredGroups[i].visibleOptions.length;
    }

    return flatIndex + optionIndex;
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

  private scrollToSelectedOption(): void {
    const selectedIndex = this.selectedIndex();
    if (selectedIndex < 0) return;

    // Use a timeout to ensure DOM is updated
    setTimeout(() => {
      const selectedElement = document.querySelector(`z-command-option.bg-accent`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 0);
  }
}
