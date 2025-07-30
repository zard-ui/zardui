import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, forwardRef, inject, input, Output, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
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
      <svg
        class="mr-2 h-4 w-4 shrink-0 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
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
export class ZardCommandInputComponent implements ControlValueAccessor {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<ClassValue>('');

  @Output() readonly valueChange = new EventEmitter<string>();

  readonly searchTerm = signal('');

  protected readonly classes = computed(() => mergeClasses(commandInputVariants({}), this.class()));

  private onChange = (_value: string) => {
    // ControlValueAccessor implementation - intentionally empty
  };
  private onTouched = () => {
    // ControlValueAccessor implementation - intentionally empty
  };

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);
    if (this.commandComponent) {
      this.commandComponent.onSearch(value);
    }
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onKeyDown(_event: KeyboardEvent) {
    // Keyboard navigation can be handled by parent command component
    // This is just for basic input handling
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
}
