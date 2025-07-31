### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  EventEmitter,
  forwardRef,
  HostListener,
  input,
  Output,
  QueryList,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandOptionComponent } from './command-option.component';
import { commandVariants, ZardCommandVariants } from './command.variants';

export interface ZardCommandOption {
  value: unknown;
  label: string;
  disabled?: boolean;
  command?: string;
  shortcut?: string;
  icon?: string;
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
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandComponent),
      multi: true,
    },
  ],
})
export class ZardCommandComponent implements ControlValueAccessor, AfterContentInit {
  @ContentChildren(ZardCommandOptionComponent, { descendants: true })
  optionComponents!: QueryList<ZardCommandOptionComponent>;

  readonly size = input<ZardCommandVariants['size']>('default');
  readonly class = input<ClassValue>('');

  @Output() readonly zOnChange = new EventEmitter<ZardCommandOption>();
  @Output() readonly zOnSelect = new EventEmitter<ZardCommandOption>();

  // Internal signals for search functionality
  readonly searchTerm = signal('');
  readonly selectedIndex = signal(-1);

  protected readonly classes = computed(() => mergeClasses(commandVariants({ size: this.size() }), this.class()));

  // Computed signal for filtered options - this will automatically update when searchTerm changes
  readonly filteredOptions = computed(() => {
    if (!this.optionComponents) return [];

    const searchTerm = this.searchTerm().toLowerCase();
    if (searchTerm === '') return this.optionComponents.toArray();

    return this.optionComponents.filter(option => {
      const label = option.zLabel().toLowerCase();
      const command = option.zCommand()?.toLowerCase() || '';
      return label.includes(searchTerm) || command.includes(searchTerm);
    });
  });

  // Status message for screen readers
  protected readonly statusMessage = computed(() => {
    const searchTerm = this.searchTerm();
    const filteredCount = this.filteredOptions().length;

    if (searchTerm === '') return '';

    if (filteredCount === 0) {
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

  ngAfterContentInit() {
    // No need to manually update filtered options - computed signal handles this
    this.optionComponents.changes.subscribe(() => {
      // When options change, the computed signal will automatically recalculate
    });
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

  @HostListener('keydown', ['$event'])
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
    filteredOptions.forEach(option => option.setSelected(false));

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
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const commandVariants = cva('flex h-full w-full flex-col overflow-hidden shadow-md border rounded-md bg-popover text-popover-foreground', {
  variants: {
    size: {
      sm: 'min-h-64',
      default: 'min-h-80',
      lg: 'min-h-96',
      xl: 'min-h-[30rem]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const commandInputVariants = cva(
  'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const commandListVariants = cva('max-h-[300px] overflow-y-auto overflow-x-hidden p-1', {
  variants: {},
  defaultVariants: {},
});

export const commandEmptyVariants = cva('py-6 text-center text-sm text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export const commandGroupVariants = cva('overflow-hidden text-foreground', {
  variants: {},
  defaultVariants: {},
});

export const commandGroupHeadingVariants = cva('px-2 py-1.5 text-xs font-medium text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export const commandItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'aria-selected:bg-destructive aria-selected:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const commandSeparatorVariants = cva('-mx-1 my-1 h-px bg-border', {
  variants: {},
  defaultVariants: {},
});

export const commandShortcutVariants = cva('ml-auto text-xs tracking-widest text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export type ZardCommandVariants = VariantProps<typeof commandVariants>;
export type ZardCommandItemVariants = VariantProps<typeof commandItemVariants>;

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-divider.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandComponent } from './command.component';
import { commandSeparatorVariants } from './command.variants';

@Component({
  selector: 'z-command-divider',
  exportAs: 'zCommandDivider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="separator"></div>
    }
  `,
})
export class ZardCommandDividerComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandSeparatorVariants({}), this.class()));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent) return true;

    const searchTerm = this.commandComponent.searchTerm();

    // If no search, always show dividers
    if (searchTerm === '') return true;

    // If there's a search term, hide all dividers for now
    // This is a simple approach - we can make it smarter later
    return false;
  });
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-empty.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandJsonComponent } from './command-json.component';
import { ZardCommandComponent } from './command.component';
import { commandEmptyVariants } from './command.variants';

@Component({
  selector: 'z-command-empty',
  exportAs: 'zCommandEmpty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()">
        <ng-content>No results found.</ng-content>
      </div>
    }
  `,
})
export class ZardCommandEmptyComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  private readonly jsonCommandComponent = inject(ZardCommandJsonComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandEmptyVariants({}), this.class()));

  protected readonly shouldShow = computed(() => {
    // Check traditional command component
    if (this.commandComponent) {
      const searchTerm = this.commandComponent.searchTerm();
      const filteredOptions = this.commandComponent.filteredOptions();
      return searchTerm.length > 0 && filteredOptions.length === 0;
    }

    // Check JSON command component
    if (this.jsonCommandComponent) {
      const searchTerm = this.jsonCommandComponent.searchTerm();
      const filteredGroups = this.jsonCommandComponent.filteredGroups();
      return searchTerm.length > 0 && filteredGroups.length === 0;
    }

    return false;
  });
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-input.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandJsonComponent } from './command-json.component';
import { ZardCommandComponent } from './command.component';
import { commandInputVariants } from './command.variants';

@Component({
  selector: 'z-command-input',
  exportAs: 'zCommandInput',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex items-center border-b px-3" cmdk-input-wrapper="">
      <div class="icon-search mr-2 h-4 w-4 shrink-0 opacity-50 flex items-center justify-center"></div>
      <input
        #searchInput
        [class]="classes()"
        [placeholder]="placeholder()"
        [(ngModel)]="searchTerm"
        (input)="onInput($event)"
        (keydown)="onKeyDown($event)"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        role="combobox"
        [attr.aria-expanded]="true"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-controls]="'command-list'"
        [attr.aria-label]="'Search commands'"
        [attr.aria-describedby]="'command-instructions'"
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandInputComponent),
      multi: true,
    },
  ],
})
export class ZardCommandInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  private readonly jsonCommandComponent = inject(ZardCommandJsonComponent, { optional: true });
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<ClassValue>('');

  @Output() readonly valueChange = new EventEmitter<string>();

  readonly searchTerm = signal('');
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  protected readonly classes = computed(() => mergeClasses(commandInputVariants({}), this.class()));

  private onChange = (_value: string) => {
    // ControlValueAccessor implementation - intentionally empty
  };
  private onTouched = () => {
    // ControlValueAccessor implementation - intentionally empty
  };

  ngOnInit(): void {
    // Set up debounced search stream - always send to subject
    this.searchSubject
      .pipe(
        switchMap(value => {
          // If empty, emit immediately, otherwise debounce
          return value === '' ? timer(0) : timer(150);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        // Get the current value from the signal to ensure we have the latest
        const currentValue = this.searchTerm();
        this.updateParentComponents(currentValue);
      });
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);

    // Always send to subject - let the stream handle timing
    this.searchSubject.next(value);
  }

  private updateParentComponents(value: string): void {
    // Send search to appropriate parent component
    if (this.commandComponent) {
      this.commandComponent.onSearch(value);
    } else if (this.jsonCommandComponent) {
      this.jsonCommandComponent.onSearch(value);
    }
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent) {
    // Let parent command component handle navigation keys
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
      event.preventDefault(); // Prevent default input behavior
      event.stopPropagation(); // Stop the event from bubbling up

      // Try both types of parent components
      if (this.commandComponent) {
        this.commandComponent.onKeyDown(event);
      } else if (this.jsonCommandComponent) {
        this.jsonCommandComponent.handleKeydown(event);
      }
      return;
    }
    // Handle other keys as needed
  }

  writeValue(value: string): void {
    this.searchTerm.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Implementation if needed for form control disabled state
  }

  ngOnDestroy(): void {
    // Complete subjects to clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-json.component.ts

```angular-ts showLineNumbers
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

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-list.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { commandListVariants } from './command.variants';

@Component({
  selector: 'z-command-list',
  exportAs: 'zCommandList',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()" role="listbox" id="command-list">
      <ng-content></ng-content>
    </div>
  `,
})
export class ZardCommandListComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandListVariants({}), this.class()));
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-option-group.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChildren, inject, input, QueryList, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandComponent } from './command.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { commandGroupHeadingVariants, commandGroupVariants } from './command.variants';

@Component({
  selector: 'z-command-option-group',
  exportAs: 'zCommandOptionGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="group">
        @if (zLabel()) {
          <div [class]="headingClasses()" role="presentation">
            {{ zLabel() }}
          </div>
        }
        <div role="group">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
})
export class ZardCommandOptionGroupComponent implements AfterContentInit {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  @ContentChildren(ZardCommandOptionComponent, { descendants: true })
  optionComponents!: QueryList<ZardCommandOptionComponent>;

  readonly zLabel = input.required<string>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandGroupVariants({}), this.class()));

  protected readonly headingClasses = computed(() => mergeClasses(commandGroupHeadingVariants({})));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent || !this.optionComponents) return true;

    const searchTerm = this.commandComponent.searchTerm();
    const filteredOptions = this.commandComponent.filteredOptions();

    // If no search term, show all groups
    if (searchTerm === '') return true;

    // Check if any option in this group is in the filtered list
    return this.optionComponents.some(option => filteredOptions.includes(option));
  });

  ngAfterContentInit() {
    // Component is ready when content children are initialized
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">command-option.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, signal, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardCommandComponent } from './command.component';
import { commandItemVariants, commandShortcutVariants, ZardCommandItemVariants } from './command.variants';

@Component({
  selector: 'z-command-option',
  exportAs: 'zCommandOption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div
        [class]="classes()"
        [attr.role]="'option'"
        [attr.aria-selected]="isSelected()"
        [attr.data-selected]="isSelected()"
        [attr.data-disabled]="zDisabled()"
        [attr.tabindex]="0"
        (click)="onClick()"
        (keydown)="onKeyDown($event)"
        (mouseenter)="onMouseEnter()"
      >
        @if (zIcon()) {
          <div class="mr-2 shrink-0 flex items-center justify-center w-4 h-4" [innerHTML]="zIcon()"></div>
        }
        <span class="flex-1">{{ zLabel() }}</span>
        @if (zShortcut()) {
          <span [class]="shortcutClasses()">{{ zShortcut() }}</span>
        }
      </div>
    }
  `,
})
export class ZardCommandOptionComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly zValue = input.required<unknown>();
  readonly zLabel = input.required<string>();
  readonly zIcon = input<string>('');
  readonly zCommand = input<string>('');
  readonly zShortcut = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly variant = input<ZardCommandItemVariants['variant']>('default');
  readonly class = input<ClassValue>('');

  readonly isSelected = signal(false);

  protected readonly classes = computed(() => {
    const baseClasses = commandItemVariants({ variant: this.variant() });
    const selectedClasses = this.isSelected() ? 'bg-accent text-accent-foreground' : '';
    return mergeClasses(baseClasses, selectedClasses, this.class());
  });

  protected readonly shortcutClasses = computed(() => mergeClasses(commandShortcutVariants({})));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent) return true;

    const filteredOptions = this.commandComponent.filteredOptions();
    const searchTerm = this.commandComponent.searchTerm();

    // If no search term, show all options
    if (searchTerm === '') return true;

    // Check if this option is in the filtered list
    return filteredOptions.includes(this);
  });

  onClick() {
    if (this.zDisabled()) return;
    if (this.commandComponent) {
      this.commandComponent.selectOption(this);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }

  onMouseEnter() {
    if (this.zDisabled()) return;
    // Visual feedback for hover
  }

  setSelected(selected: boolean) {
    this.isSelected.set(selected);
  }

  focus() {
    const element = this.elementRef.nativeElement;
    element.focus();
    // Scroll element into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

```

