

```angular-ts title="command.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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

```



```angular-ts title="command.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

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



```angular-ts title="command-divider.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandComponent } from './command.component';
import { commandSeparatorVariants } from './command.variants';

import type { ClassValue } from 'clsx';
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



```angular-ts title="command-empty.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandComponent } from './command.component';
import { commandEmptyVariants } from './command.variants';

import type { ClassValue } from 'clsx';

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

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandEmptyVariants({}), this.class()));

  protected readonly shouldShow = computed(() => {
    // Check traditional command component
    if (this.commandComponent) {
      const filteredOptions = this.commandComponent.filteredOptions();
      return filteredOptions.length === 0;
    }

    return false;
  });
}

```



```angular-ts title="command-input.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  Output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, switchMap, timer } from 'rxjs';
import type { ClassValue } from 'clsx';

import { ZardIconComponent } from '../icon/icon.component';
import { ZardCommandComponent } from './command.component';
import { commandInputVariants } from './command.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'z-command-input',
  exportAs: 'zCommandInput',
  standalone: true,
  imports: [FormsModule, ZardIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex items-center border-b px-3" cmdk-input-wrapper="">
      <z-icon zType="search" class="mr-2 shrink-0 opacity-50" />
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
  private readonly destroyRef = inject(DestroyRef);
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<ClassValue>('');

  @Output() readonly valueChange = new EventEmitter<string>();

  readonly searchTerm = signal('');
  private readonly searchSubject = new Subject<string>();

  protected readonly classes = computed(() => mergeClasses(commandInputVariants({}), this.class()));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_: string) => {
    // ControlValueAccessor implementation - intentionally empty
  };
  private onTouched = () => {
    // ControlValueAccessor implementation - intentionally empty
  };

  ngOnInit(): void {
    // Set up debounced search stream - always send to subject
    this.searchSubject
      .pipe(
        // If empty, emit immediately, otherwise debounce
        switchMap(value => (value ? timer(150) : timer(0))),
        takeUntilDestroyed(this.destroyRef),
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
    }
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent) {
    // Let parent command component handle navigation keys
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
      // For Escape key, don't stop propagation to allow document listener to work
      if (event.key !== 'Escape') {
        event.preventDefault(); // Prevent default input behavior
        event.stopPropagation(); // Stop the event from bubbling up
      }

      // Send to parent command component
      if (this.commandComponent) {
        this.commandComponent.onKeyDown(event);
      }
    }
    // Handle other keys as needed
  }

  writeValue(value: string | null): void {
    this.searchTerm.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDisabledState(_: boolean): void {
    // Implementation if needed for form control disabled state
  }

  /**
   * Focus the input element
   */
  focus(): void {
    this.searchInput().nativeElement.focus();
  }

  ngOnDestroy(): void {
    // Complete subjects to clean up subscriptions
    this.searchSubject.complete();
  }
}

```



```angular-ts title="command-list.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

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



```angular-ts title="command-option-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { type AfterContentInit, ChangeDetectionStrategy, Component, computed, contentChildren, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandComponent } from './command.component';
import { commandGroupHeadingVariants, commandGroupVariants } from './command.variants';

import type { ClassValue } from 'clsx';

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

  readonly optionComponents = contentChildren(ZardCommandOptionComponent, { descendants: true });

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
    return this.optionComponents().some(option => filteredOptions.includes(option));
  });

  ngAfterContentInit() {
    // Component is ready when content children are initialized
  }
}

```



```angular-ts title="command-option.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, signal, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';

import { commandItemVariants, commandShortcutVariants, type ZardCommandItemVariants } from './command.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';
import { ZardCommandComponent } from './command.component';
import type { ZardIcon } from '../icon/icons';

@Component({
  selector: 'z-command-option',
  exportAs: 'zCommandOption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardIconComponent],
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
          <div z-icon [zType]="zIcon()!" class="mr-2 shrink-0 flex items-center justify-center"></div>
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
  readonly zCommand = input<string>('');
  readonly zIcon = input<ZardIcon>();
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



```angular-ts title="command.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { ZardCommandDividerComponent } from './command-divider.component';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandInputComponent } from './command-input.component';
import { ZardCommandEmptyComponent } from './command-empty.component';
import { ZardCommandListComponent } from './command-list.component';
import { ZardCommandComponent } from './command.component';

const COMMAND_COMPONENTS = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandEmptyComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
];

@NgModule({
  imports: [FormsModule, ...COMMAND_COMPONENTS],
  exports: [...COMMAND_COMPONENTS],
})
export class ZardCommandModule {}

```

