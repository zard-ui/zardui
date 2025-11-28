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

import { ZardCommandComponent } from './command.component';
import { commandInputVariants } from './command.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { checkForProperZardInitialization } from '../core/providezard';
import { ZardIconComponent } from '../icon/icon.component';

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

  readonly classes = computed(() => mergeClasses(commandInputVariants({}), this.class()));

  readonly disabled = signal(false);

  protected onChange = (_: string) => {
    // ControlValueAccessor implementation - intentionally empty
  };

  protected onTouched = () => {
    // ControlValueAccessor implementation - intentionally empty
  };

  constructor() {
    checkForProperZardInitialization();
  }

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
