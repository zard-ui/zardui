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
      <z-command-input [placeholder]="config().placeholder || 'Type a command or search...'" (input)="onSearch($any($event.target).value)"> </z-command-input>
      <z-command-list>
        <z-command-empty>{{ config().emptyText || 'No results found.' }}</z-command-empty>

        @for (group of filteredGroups(); track group.label; let index = $index) {
          <z-command-option-group [zLabel]="group.label">
            @for (option of group.visibleOptions; track option.value) {
              <z-command-option
                [zLabel]="option.label"
                [zValue]="option.value"
                [zIcon]="option.icon || ''"
                [zShortcut]="option.shortcut || ''"
                [zCommand]="option.command || ''"
                [zDisabled]="option.disabled || false"
                (click)="onOptionClick(option)"
              >
              </z-command-option>
            }
          </z-command-option-group>

          @if (config().dividers !== false && shouldShowDivider(index)) {
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

  private onChange = (_value: unknown) => {
    // ControlValueAccessor implementation
  };
  private onTouched = () => {
    // ControlValueAccessor implementation
  };

  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
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

  // Handle keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      const matchingOption = this.findOptionByKey(event.key.toLowerCase());
      if (matchingOption) {
        event.preventDefault();
        this.onOptionClick(matchingOption);
      }
    }
  }

  private findOptionByKey(key: string): ZardCommandOption | undefined {
    for (const group of this.config().groups) {
      const option = group.options.find(opt => opt.key?.toLowerCase() === key);
      if (option) return option;
    }
    return undefined;
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
}
