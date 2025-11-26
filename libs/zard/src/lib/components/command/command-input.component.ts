import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  type ElementRef,
  forwardRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { Subject, switchMap, timer } from 'rxjs';

import { ZardCommandComponent } from './command.component';
import { commandInputVariants } from './command.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-command-input',
  imports: [FormsModule, ZardIconComponent],
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandInput',
})
export class ZardCommandInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<ClassValue>('');

  readonly valueChange = output<string>();

  readonly searchTerm = signal('');
  private readonly searchSubject = new Subject<string>();

  protected readonly classes = computed(() => mergeClasses(commandInputVariants({}), this.class()));

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
