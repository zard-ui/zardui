

```angular-ts title="command.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardCommandInputComponent } from '@/shared/components/command/command-input.component';
import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { commandVariants, type ZardCommandSizeVariants } from '@/shared/components/command/command.variants';
import type { ZardIcon } from '@/shared/components/icon';
import { mergeClasses } from '@/shared/utils/merge-classes';

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

export abstract class ZardCommand {
  abstract registerOption(option: ZardCommandOptionComponent): void;
  abstract unregisterOption(option: ZardCommandOptionComponent): void;
}

@Component({
  selector: 'z-command',
  imports: [FormsModule],
  template: `
    <div [class]="classes()">
      <div id="command-instructions" class="sr-only">
        Use arrow keys to navigate, Enter to select, Escape to clear selection.
      </div>
      <div id="command-status" class="sr-only" aria-live="polite" aria-atomic="true">
        {{ statusMessage() }}
      </div>
      <ng-content />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'combobox',
    'aria-haspopup': 'listbox',
    '[attr.aria-expanded]': 'true',
    '(keydown.{arrowdown,arrowup,enter,escape}.prevent)': 'onKeyDown($event)',
  },
  exportAs: 'zCommand',
})
export class ZardCommandComponent implements ControlValueAccessor, ZardCommand {
  private readonly commandInput = contentChild(ZardCommandInputComponent);
  private readonly optionComponentsAsChildren = contentChildren(ZardCommandOptionComponent, { descendants: true });
  private readonly registeredOptionComponents = signal<ZardCommandOptionComponent[]>([]);

  readonly size = input<ZardCommandSizeVariants>('default');
  readonly class = input<ClassValue>('');

  readonly zCommandChange = output<ZardCommandOption>();
  readonly zCommandSelected = output<ZardCommandOption>();

  // Internal signals for search functionality
  readonly searchTerm = signal('');
  readonly selectedIndex = signal(-1);

  protected readonly optionComponents = computed(() =>
    this.optionComponentsAsChildren().length ? this.optionComponentsAsChildren() : this.registeredOptionComponents(),
  );

  registerOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => [...current, option]);
  }

  unregisterOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => current.filter(o => o !== option));
  }

  // Signal to trigger updates when optionComponents change
  private readonly optionsUpdateTrigger = signal(0);

  protected readonly classes = computed(() => mergeClasses(commandVariants({ size: this.size() }), this.class()));

  // Computed signal for filtered options - this will automatically update when searchTerm or options change
  readonly filteredOptions = computed(() => {
    const searchTerm = this.searchTerm();
    // Include the trigger signal to make this computed reactive to option changes
    this.optionsUpdateTrigger();

    if (!this.optionComponents()) {
      return [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerSearchTerm) {
      return this.optionComponents();
    }

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

    if (!searchTerm) {
      return searchTerm;
    }

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
    this.triggerOptionsUpdate();
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
    this.zCommandChange.emit(commandOption);
    this.zCommandSelected.emit(commandOption);
  }

  // in @Component host: '(keydown)': 'onKeyDown($event)'
  onKeyDown(event: Event) {
    const filteredOptions = this.filteredOptions();
    if (filteredOptions.length === 0) {
      return;
    }

    const { key } = event as KeyboardEvent;

    const currentIndex = this.selectedIndex();

    switch (key) {
      case 'ArrowDown': {
        const nextIndex = currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
        this.selectedIndex.set(nextIndex);
        this.updateSelectedOption();
        break;
      }

      case 'ArrowUp': {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
        this.selectedIndex.set(prevIndex);
        this.updateSelectedOption();
        break;
      }

      case 'Enter':
        if (currentIndex >= 0 && currentIndex < filteredOptions.length) {
          const selectedOption = filteredOptions[currentIndex];
          if (!selectedOption.zDisabled()) {
            this.selectOption(selectedOption);
          }
        }
        break;

      case 'Escape':
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

export const commandVariants = cva(
  'flex h-full w-full flex-col overflow-hidden shadow-md border rounded-md bg-popover text-popover-foreground',
  {
    variants: {
      size: {
        sm: 'min-h-64',
        default: 'min-h-80',
        lg: 'min-h-96',
        xl: 'min-h-120',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export const commandInputVariants = cva(
  'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const commandListVariants = cva('max-h-75 overflow-y-auto overflow-x-hidden p-1', {
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
        destructive:
          'aria-selected:bg-destructive aria-selected:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground',
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

export type ZardCommandSizeVariants = NonNullable<VariantProps<typeof commandVariants>['size']>;
export type ZardCommandItemVariants = NonNullable<VariantProps<typeof commandItemVariants>['variant']>;

```



```angular-ts title="command-divider.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { commandSeparatorVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-divider',
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="separator"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandDivider',
})
export class ZardCommandDividerComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandSeparatorVariants(), this.class()));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent) {
      return true;
    }

    const searchTerm = this.commandComponent.searchTerm();

    // If no search, always show dividers
    if (searchTerm === '') {
      return true;
    }

    // If there's a search term, hide all dividers for now
    // This is a simple approach - we can make it smarter later
    return false;
  });
}

```



```angular-ts title="command-empty.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { commandEmptyVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-empty',
  template: `
    @if (shouldShow()) {
      <div [class]="classes()">
        <ng-content>No results found.</ng-content>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandEmpty',
})
export class ZardCommandEmptyComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandEmptyVariants(), this.class()));

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
  type ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { commandInputVariants } from '@/shared/components/command/command.variants';
import { ZardIconComponent } from '@/shared/components/icon';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-input',
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center border-b px-3" cmdk-input-wrapper="">
      <z-icon zType="search" class="mr-2 shrink-0 opacity-50" />
      <input
        #searchInput
        [class]="classes()"
        [placeholder]="placeholder()"
        [value]="searchTerm()"
        [disabled]="disabled()"
        (input.debounce.150)="onInput($event)"
        (keydown)="onKeyDown($event)"
        (blur)="onTouched()"
        aria-controls="command-list"
        aria-describedby="command-instructions"
        aria-haspopup="listbox"
        aria-label="Search commands"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        role="combobox"
        [attr.aria-expanded]="true"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandInput',
})
export class ZardCommandInputComponent implements ControlValueAccessor {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<ClassValue>('');

  readonly valueChange = output<string>();

  readonly searchTerm = signal('');

  readonly classes = computed(() => mergeClasses(commandInputVariants(), this.class()));

  readonly disabled = signal(false);

  protected onChange = (_: string) => {
    // ControlValueAccessor implementation - intentionally empty
  };

  protected onTouched = () => {
    // ControlValueAccessor implementation - intentionally empty
  };

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    this.searchTerm.set(value);
    this.updateParentComponents(value);
  }

  updateParentComponents(value: string): void {
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
    const normalizedValue = value ?? '';
    this.searchTerm.set(normalizedValue);
    if (this.commandComponent) {
      this.commandComponent.onSearch(normalizedValue);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /**
   * Focus the input element
   */
  focus(): void {
    this.searchInput().nativeElement.focus();
  }
}

```



```angular-ts title="command-list.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { commandListVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-list',
  template: `
    <div [class]="classes()" role="listbox" id="command-list">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandList',
})
export class ZardCommandListComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandListVariants(), this.class()));
}

```



```angular-ts title="command-option-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { commandGroupHeadingVariants, commandGroupVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

export abstract class ZardCommandOptionGroup {
  abstract registerOption(option: ZardCommandOptionComponent): void;
  abstract unregisterOption(option: ZardCommandOptionComponent): void;
}

@Component({
  selector: 'z-command-option-group',
  template: `
    @if (isGroupVisible()) {
      <div [class]="classes()" role="group">
        @if (zLabel()) {
          <div [class]="headingClasses()" role="presentation">
            {{ zLabel() }}
          </div>
        }
        <div role="group">
          <ng-content />
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandOptionGroup',
})
export class ZardCommandOptionGroupComponent implements ZardCommandOptionGroup {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  private readonly optionComponentsAsChildren = contentChildren(ZardCommandOptionComponent, { descendants: true });
  private readonly registeredOptionComponents = signal<ZardCommandOptionComponent[]>([]);

  readonly zLabel = input.required<string>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandGroupVariants({}), this.class()));
  protected readonly headingClasses = computed(() => mergeClasses(commandGroupHeadingVariants({})));
  private readonly optionComponents = computed(() =>
    this.optionComponentsAsChildren().length ? this.optionComponentsAsChildren() : this.registeredOptionComponents(),
  );

  protected readonly isGroupVisible = computed(() => {
    if (!this.commandComponent || !this.optionComponents().length) {
      return true;
    }

    const searchTerm = this.commandComponent.searchTerm();
    // If no search term, show all groups
    if (!searchTerm) {
      return true;
    }

    const filteredOptions = this.commandComponent.filteredOptions();
    // Check if any option in this group is in the filtered list
    return this.optionComponents().some(option => filteredOptions.includes(option));
  });

  registerOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => [...current, option]);
  }

  unregisterOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => current.filter(o => o !== option));
  }
}

```



```angular-ts title="command-option.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardCommandOptionGroupComponent } from '@/shared/components/command/command-option-group.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import {
  commandItemVariants,
  commandShortcutVariants,
  type ZardCommandItemVariants,
} from '@/shared/components/command/command.variants';
import { ZardIconComponent, type ZardIcon } from '@/shared/components/icon';
import { mergeClasses, transform } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-option',
  imports: [ZardIconComponent],
  template: `
    @if (isOptionVisible()) {
      <div
        [class]="classes()"
        [attr.role]="'option'"
        [attr.aria-selected]="isSelected()"
        [attr.data-selected]="isSelected()"
        [attr.data-disabled]="zDisabled()"
        [attr.tabindex]="0"
        (click)="onClick()"
        (keydown.{enter,space}.prevent)="onClick()"
        (mouseenter)="onMouseEnter()"
      >
        @if (zIcon()) {
          <div z-icon [zType]="zIcon()!" class="mr-2 flex shrink-0 items-center justify-center"></div>
        }
        <span class="flex-1">{{ zLabel() }}</span>
        @if (zShortcut()) {
          <span [class]="shortcutClasses()">{{ zShortcut() }}</span>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandOption',
})
export class ZardCommandOptionComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly parentCommandComponent = inject(ZardCommandComponent, { optional: true });

  readonly zValue = input.required<unknown>();
  readonly zLabel = input.required<string>();
  readonly zCommand = input<string>('');
  readonly zIcon = input<ZardIcon>();
  readonly zShortcut = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly variant = input<ZardCommandItemVariants>('default');
  readonly class = input<ClassValue>('');
  readonly parentCommand = input<ZardCommandComponent | null>(null);
  readonly commandGroup = input<ZardCommandOptionGroupComponent | null>(null);

  readonly isSelected = signal(false);

  protected readonly classes = computed(() => {
    const baseClasses = commandItemVariants({ variant: this.variant() });
    const selectedClasses = this.isSelected() ? 'bg-accent text-accent-foreground' : '';
    return mergeClasses(baseClasses, selectedClasses, this.class());
  });

  protected readonly shortcutClasses = computed(() => mergeClasses(commandShortcutVariants()));

  private get commandComponent() {
    let parent = this.parentCommand();
    parent ||= this.parentCommandComponent;
    return parent;
  }

  protected readonly isOptionVisible = computed(() => {
    const parent = this.commandComponent;

    if (!parent) {
      return true;
    }
    /*
      If no search term, show this option, otherwise check
      if this option is included in the filtered list
     */
    return !parent.searchTerm() || parent.filteredOptions().includes(this);
  });

  constructor() {
    effect(onCleanup => {
      const cmd = this.parentCommand();
      const grp = this.commandGroup();

      if (cmd) {
        cmd.registerOption(this);
        onCleanup(() => cmd.unregisterOption(this));
      }

      if (grp) {
        grp.registerOption(this);
        onCleanup(() => grp.unregisterOption(this));
      }
    });
  }

  onClick() {
    if (this.zDisabled()) {
      return;
    }

    this.commandComponent?.selectOption(this);
  }

  onMouseEnter() {
    if (this.zDisabled()) {
      return;
    }
    // Visual feedback for hover
  }

  setSelected(selected: boolean) {
    this.isSelected.set(selected);
  }

  focus() {
    const element = this.elementRef.nativeElement;
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

```



```angular-ts title="command.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ZardCommandDividerComponent } from '@/shared/components/command/command-divider.component';
import { ZardCommandEmptyComponent } from '@/shared/components/command/command-empty.component';
import { ZardCommandInputComponent } from '@/shared/components/command/command-input.component';
import { ZardCommandListComponent } from '@/shared/components/command/command-list.component';
import { ZardCommandOptionGroupComponent } from '@/shared/components/command/command-option-group.component';
import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';

export const ZardCommandImports = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandEmptyComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
] as const;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from '@/shared/components/command/command.component';
export * from '@/shared/components/command/command-input.component';
export * from '@/shared/components/command/command-list.component';
export * from '@/shared/components/command/command-empty.component';
export * from '@/shared/components/command/command-option.component';
export * from '@/shared/components/command/command-option-group.component';
export * from '@/shared/components/command/command-divider.component';
export * from '@/shared/components/command/command.imports';
export * from '@/shared/components/command/command.variants';

```

