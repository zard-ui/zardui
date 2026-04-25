import {
  ChangeDetectionStrategy,
  Component,
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { ZardInputGroupComponent } from '@/shared/components/input-group/input-group.component';

@Component({
  selector: 'z-command-input',
  imports: [NgIcon, ZardInputGroupComponent, ZardInputDirective],
  template: `
    <div data-slot="command-input-wrapper" class="p-1 pb-0">
      <z-input-group
        class="border-input/30 has-[input:focus-visible]:border-input/30! h-8! rounded-lg! shadow-none! has-[input:focus-visible]:ring-0! [&>div]:h-8!"
        [zAddonBefore]="searchIcon"
      >
        <input
          z-input
          #searchInput
          class="h-8! w-full border-transparent! bg-transparent text-sm outline-hidden focus-visible:border-transparent! focus-visible:ring-0! disabled:cursor-not-allowed disabled:opacity-50"
          [placeholder]="placeholder()"
          [value]="searchTerm()"
          [disabled]="disabled()"
          (input)="onInput($event)"
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
      </z-input-group>
    </div>

    <ng-template #searchIcon>
      <ng-icon name="lucideSearch" class="size-4! shrink-0 opacity-50" />
    </ng-template>
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
  viewProviders: [provideIcons({ lucideSearch })],
  exportAs: 'zCommandInput',
})
export class ZardCommandInputComponent implements ControlValueAccessor {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  readonly placeholder = input<string>('Type a command or search...');

  readonly valueChange = output<string>();

  readonly searchTerm = signal('');
  readonly disabled = signal(false);

  protected onChange = (_: string) => {
    /* CVA */
  };

  protected onTouched = () => {
    /* CVA */
  };

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.updateParentComponents(value);
  }

  updateParentComponents(value: string): void {
    this.searchTerm.set(value);
    this.commandComponent?.onSearch(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
      if (event.key !== 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
      this.commandComponent?.onKeyDown(event);
    }
  }

  writeValue(value: string | null): void {
    const normalized = value ?? '';
    this.searchTerm.set(normalized);
    this.commandComponent?.onSearch(normalized);
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

  focus(): void {
    this.searchInput().nativeElement.focus();
  }
}
