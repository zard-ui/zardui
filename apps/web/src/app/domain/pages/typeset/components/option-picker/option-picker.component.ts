import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { TypesetChoice } from '../../models/typeset.model';

/**
 * A row of mutually exclusive values.
 *
 * A segmented row rather than a select: there are never more than four options,
 * and seeing the neighbours is half of choosing between them.
 */
@Component({
  selector: 'app-option-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-3">
      <span class="text-muted-foreground shrink-0 text-xs font-medium" [id]="controlId()">{{ label() }}</span>

      <div class="bg-muted/50 flex gap-0.5 rounded-md p-0.5" role="radiogroup" [attr.aria-labelledby]="controlId()">
        @for (choice of choices(); track choice.value) {
          <button
            type="button"
            role="radio"
            class="focus-visible:ring-ring rounded-sm px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            [class.bg-background]="choice.value === value()"
            [class.shadow-sm]="choice.value === value()"
            [class.text-foreground]="choice.value === value()"
            [class.text-muted-foreground]="choice.value !== value()"
            [attr.aria-checked]="choice.value === value()"
            (click)="valueChange.emit(choice.value)"
          >
            {{ choice.label }}
          </button>
        }
      </div>
    </div>
  `,
})
export class OptionPickerComponent<T extends string | number> {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly choices = input.required<readonly TypesetChoice<T>[]>();
  readonly value = input.required<T>();

  readonly valueChange = output<T>();
}
