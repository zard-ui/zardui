---
title: Combobox
description: Autocomplete input and command palette with a list of suggestions.
---

# Combobox

Autocomplete input and command palette with a list of suggestions.

## Installation

### CLI

```bash
npx zard-cli@latest add combobox
```

### Manual

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  output,
  runInInjectionContext,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon, provideIcons, type IconName } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent, type ZardButtonTypeVariants } from '@/shared/components/button';
import { comboboxVariants, type ZardComboboxWidthVariants } from '@/shared/components/combobox/combobox.variants';
import {
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  type ZardCommandOption,
} from '@/shared/components/command';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover';
import { mergeClasses } from '@/shared/utils/merge-classes';

export interface ZardComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: IconName;
}

export interface ZardComboboxGroup {
  label?: string;
  options: ZardComboboxOption[];
}

@Component({
  selector: 'z-combobox',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    NgIcon,
    ZardButtonComponent,
    ZardCommandComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardPopoverDirective,
    ZardPopoverComponent,
    ZardEmptyComponent,
  ],
  template: `
    <button
      type="button"
      z-button
      zPopover
      role="combobox"
      [zContent]="popoverContent"
      [zType]="buttonVariant()"
      [class]="buttonClasses()"
      [zDisabled]="disabledState()"
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
      <span class="flex-1 truncate text-left">
        {{ displayValue() ?? placeholder() }}
      </span>
      <ng-icon name="lucideChevronsUpDown" class="ml-2 shrink-0 opacity-50" />
    </button>

    <ng-template #popoverContent>
      <z-popover [class]="popoverClasses()">
        <z-command class="min-h-auto" (zCommandSelected)="handleSelect($event)" #commandRef>
          @if (searchable()) {
            <z-command-input [placeholder]="searchPlaceholder()" #commandInputRef />
          }

          <z-command-list id="combobox-listbox" role="listbox">
            @if (emptyText() && commandRef.isEmpty()) {
              <z-empty [zDescription]="emptyText()" />
            }

            @for (group of groups(); track group.label ?? $index) {
              @if (group.label) {
                <z-command-option-group [zLabel]="group.label" #commandGroup>
                  @for (option of group.options; track option.value) {
                    <ng-container
                      [ngTemplateOutlet]="commandOption"
                      [ngTemplateOutletContext]="{
                        $implicit: option,
                        commandInstance: commandRef,
                        groupInstance: commandGroup,
                      }"
                    />
                  }
                </z-command-option-group>
              } @else {
                @for (option of group.options; track option.value) {
                  <ng-container
                    [ngTemplateOutlet]="commandOption"
                    [ngTemplateOutletContext]="{
                      $implicit: option,
                      commandInstance: commandRef,
                    }"
                  />
                }
              }
            } @empty {
              @if (options().length > 0) {
                @for (option of options(); track option.value) {
                  <ng-container
                    [ngTemplateOutlet]="commandOption"
                    [ngTemplateOutletContext]="{
                      $implicit: option,
                      commandInstance: commandRef,
                    }"
                  />
                }
              }
            }
          </z-command-list>
        </z-command>
      </z-popover>
    </ng-template>

    <ng-template #commandOption let-option let-cmd="commandInstance" let-grp="groupInstance">
      <z-command-option
        [zValue]="option.value"
        [zLabel]="option.label"
        [zDisabled]="option.disabled ?? false"
        [zIcon]="option.icon"
        [parentCommand]="cmd"
        [commandGroup]="grp"
        [attr.aria-selected]="option.value === currentValue()"
      >
        {{ option.label }}
        @if (option.value === currentValue()) {
          <ng-icon name="lucideCheck" class="ml-auto" />
        }
      </z-command-option>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardComboboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronsUpDown, lucideCheck })],
  host: {
    '[class]': 'classes()',
    '(document:keydown.escape)': 'onDocumentKeyDown($event)',
    '(keydown.escape.prevent-with-stop)': 'onKeyDownEscape()',
    '(keydown.{arrowdown,arrowup,enter,home,end,pageup,pagedown,space}.prevent)': 'onKeyDown($event)',
    '(keydown.tab)': 'onKeyDown($event)',
  },
  exportAs: 'zCombobox',
})
export class ZardComboboxComponent implements ControlValueAccessor {
  private readonly injector = inject(Injector);

  readonly class = input<ClassValue>('');
  readonly buttonVariant = input<ZardButtonTypeVariants>('outline');
  readonly zWidth = input<ZardComboboxWidthVariants>('default');
  readonly placeholder = input<string>('Select...');
  readonly searchPlaceholder = input<string>('Search...');
  readonly emptyText = input<string>('No results found.');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly value = input<string | null>(null);
  readonly options = input<ZardComboboxOption[]>([]);
  readonly groups = input<ZardComboboxGroup[]>([]);
  readonly ariaLabel = input<string>('');
  readonly ariaDescribedBy = input<string>('');

  readonly zValueChange = output<string | null>();
  readonly zComboSelected = output<ZardComboboxOption>();

  readonly popoverDirective = viewChild.required('popoverTrigger', { read: ZardPopoverDirective });
  readonly buttonRef = viewChild.required('popoverTrigger', { read: ElementRef });
  readonly commandRef = viewChild('commandRef', { read: ZardCommandComponent });
  readonly commandInputRef = viewChild('commandInputRef', { read: ZardCommandInputComponent });

  protected readonly disabledState = linkedSignal(() => this.zDisabled());
  protected readonly internalValue = signal<string | null>(null);
  protected readonly open = signal(false);

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
    const widthClass = this.zWidth() === 'full' ? 'w-full' : comboboxVariants({ zWidth: this.zWidth() });
    return `${widthClass} p-0`;
  });

  protected readonly currentValue = computed(() => this.value() ?? this.internalValue());

  protected readonly displayValue = computed(() => {
    const currentValue = this.currentValue();
    if (!currentValue) {
      return null;
    }

    // Search in groups first
    if (this.groups().length) {
      for (const group of this.groups()) {
        const option = group.options.find(opt => opt.value === currentValue);
        if (option) {
          return option.label;
        }
      }
    }

    // Then search in flat options
    const option = this.options().find(opt => opt.value === currentValue);
    return option?.label ?? null;
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
      runInInjectionContext(this.injector, () =>
        afterNextRender(() => {
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
        }),
      );
    }
  }

  handleSelect(commandOption: ZardCommandOption) {
    const selectedValue = commandOption.value as string;

    // Toggle behavior - if same value is selected, clear it
    const newValue = selectedValue === this.currentValue() ? null : selectedValue;

    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.zValueChange.emit(newValue);

    // Emit the combobox option if we have a selection
    if (newValue) {
      let selectedOption: ZardComboboxOption | undefined;

      if (this.groups().length > 0) {
        for (const group of this.groups()) {
          selectedOption = group.options.find(opt => opt.value === newValue);
          if (selectedOption) {
            break;
          }
        }
      } else {
        selectedOption = this.options().find(opt => opt.value === newValue);
      }

      if (selectedOption) {
        this.zComboSelected.emit(selectedOption);
      }
    }

    // Close the popover
    this.popoverDirective().hide();

    // Return focus to the combobox button after selection
    this.buttonRef().nativeElement.focus();
  }

  onKeyDownEscape(): void {
    if (this.open()) {
      this.popoverDirective().hide();
      this.buttonRef().nativeElement.focus();
    } else if (this.currentValue()) {
      this.internalValue.set(null);
      this.onChange(null);
      this.zValueChange.emit(null);
    }
  }

  onKeyDown(e: Event) {
    if (this.disabledState()) {
      return;
    }

    const { key, ctrlKey, altKey, metaKey } = e as KeyboardEvent;

    // Handle different keyboard events based on combobox state
    if (this.open()) {
      // When popover is open
      switch (key) {
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
          this.commandRef()?.onKeyDown(e as KeyboardEvent);
          break;
      }
    } else {
      // When popover is closed
      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ': // Space key
          this.popoverDirective().show();
          break;
        default:
          // For searchable comboboxes, open and start typing
          if (this.searchable() && key.length === 1 && !ctrlKey && !altKey && !metaKey) {
            this.popoverDirective().show();
            // Let the command input handle the character after opening
            runInInjectionContext(this.injector, () =>
              afterNextRender(() => {
                const inputElement = this.commandInputRef();
                if (inputElement) {
                  const searchInput = inputElement.searchInput();
                  if (searchInput) {
                    searchInput.nativeElement.value = key;
                  }
                  inputElement.updateParentComponents(key);
                  inputElement.focus();
                }
              }),
            );
          }
          break;
      }
    }
  }

  // needed when component loses focus by keyboard.
  onDocumentKeyDown(event: Event) {
    // Close on Escape from anywhere when this combobox is open
    if (this.open()) {
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

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva('', {
  variants: {
    zWidth: {
      default: 'w-50',
      sm: 'w-37.5',
      md: 'w-62.5',
      lg: 'w-87.5',
      full: 'w-full',
    },
  },
  defaultVariants: {
    zWidth: 'default',
  },
});

export type ZardComboboxWidthVariants = NonNullable<VariantProps<typeof comboboxVariants>['zWidth']>;
```

```angular-ts
export * from './combobox.component';
export * from './combobox.variants';
```

## Usage

```angular-ts
import { ZardComboboxComponent } from '@/shared/components/combobox/combobox.component';
```

```angular-html
<z-combobox [options]="options" placeholder="Select framework..."></z-combobox>
```

## Examples

### Default

```angular-ts
import { Component } from '@angular/core';

import { ZardComboboxComponent, type ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-default',
  imports: [ZardComboboxComponent],
  standalone: true,
  template: `
    <z-combobox
      [options]="frameworks"
      placeholder="Select framework..."
      searchPlaceholder="Search framework..."
      emptyText="No framework found."
      (zComboSelected)="onSelect($event)"
    />
  `,
})
export class ZardDemoComboboxDefaultComponent {
  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  onSelect(option: ZardComboboxOption) {
    console.log('Selected:', option);
  }
}
```

### Grouped

```angular-ts
import { Component } from '@angular/core';

import { ZardComboboxComponent, type ZardComboboxGroup, type ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-grouped',
  imports: [ZardComboboxComponent],
  standalone: true,
  template: `
    <z-combobox
      [groups]="techGroups"
      placeholder="Select technology..."
      searchPlaceholder="Search technology..."
      emptyText="No technology found."
      (zComboSelected)="onSelect($event)"
    />
  `,
})
export class ZardDemoComboboxGroupedComponent {
  techGroups: ZardComboboxGroup[] = [
    {
      label: 'Frontend Frameworks',
      options: [
        { value: 'angular', label: 'Angular' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'svelte', label: 'Svelte' },
      ],
    },
    {
      label: 'Backend Frameworks',
      options: [
        { value: 'nestjs', label: 'NestJS' },
        { value: 'express', label: 'Express' },
        { value: 'fastify', label: 'Fastify' },
        { value: 'koa', label: 'Koa' },
      ],
    },
    {
      label: 'Full-Stack Frameworks',
      options: [
        { value: 'nextjs', label: 'Next.js' },
        { value: 'nuxtjs', label: 'Nuxt.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'sveltekit', label: 'SvelteKit' },
      ],
    },
  ];

  onSelect(option: ZardComboboxOption) {
    console.log('Selected:', option);
  }
}
```

### Disabled

```angular-ts
import { Component } from '@angular/core';

import { ZardComboboxComponent, type ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-disabled',
  imports: [ZardComboboxComponent],
  standalone: true,
  template: `
    <div class="flex gap-4">
      <z-combobox [options]="frameworks" placeholder="Disabled combobox" [zDisabled]="true" />

      <z-combobox
        [options]="frameworksWithDisabled"
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
      />
    </div>
  `,
})
export class ZardDemoComboboxDisabledComponent {
  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
  ];

  frameworksWithDisabled: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React', disabled: true },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte', disabled: true },
    { value: 'ember', label: 'Ember.js' },
  ];
}
```

### Form

```angular-ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardComboboxComponent, type ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-form',
  imports: [ReactiveFormsModule, ZardComboboxComponent, ZardButtonComponent],
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <z-combobox
        [options]="frameworks"
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
        [formControl]="frameworkControl"
      />

      <div class="flex gap-2">
        <button z-button variant="outline" (click)="setValue()">Set to Vue.js</button>
        <button z-button variant="outline" (click)="clearValue()">Clear</button>
        <button z-button variant="outline" (click)="logValue()">Log Value</button>
      </div>

      <div class="text-muted-foreground text-sm">Current value: {{ frameworkControl.value ?? 'None' }}</div>
    </div>
  `,
})
export class ZardDemoComboboxFormComponent {
  frameworkControl = new FormControl<string | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
  ];

  setValue() {
    this.frameworkControl.setValue('vue');
  }

  clearValue() {
    this.frameworkControl.setValue(null);
  }

  logValue() {
    console.log('Form Control Value:', this.frameworkControl.value);
  }
}
```

## API Reference

### z-combobox

Autocomplete input and command palette with a list of suggestions.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |
| `buttonVariant` | Button variant style | `'default' \| 'outline' \| 'secondary' \| 'ghost'` | `'outline'` |
| `zWidth` | Width of the combobox | `'default' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'default'` |
| `placeholder` | Placeholder text when no value is selected | `string` | `'Select...'` |
| `searchPlaceholder` | Placeholder for the search input | `string` | `'Search...'` |
| `emptyText` | Text shown when no options match the search | `string` | `'No results found.'` |
| `zDisabled` | Whether the combobox is disabled | `boolean` | `false` |
| `searchable` | Whether to show the search input | `boolean` | `true` |
| `value` | The selected value | `string \| null` | `null` |
| `options` | Array of options (for flat list) | `ZardComboboxOption[]` | `[]` |
| `groups` | Array of grouped options | `ZardComboboxGroup[]` | `[]` |
| `ariaLabel` | ARIA label for accessibility | `string` | `''` |
| `ariaDescribedBy` | ARIA described-by for accessibility | `string` | `''` |
| `(zValueChange)` | Emitted when the value changes | `output<string \| null>` | `-` |
| `(zComboSelected)` | Emitted when an option is selected | `output<ZardComboboxOption>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/combobox)
