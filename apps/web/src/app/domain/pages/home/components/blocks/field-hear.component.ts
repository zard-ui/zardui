import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-block-field-hear',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardCheckboxComponent, FormsModule],
  template: `
    <z-card zTitle="How did you hear about us?" class="gap-2">
      <div z-card-header>
        <z-card-title zTitle="How did you hear about us?" />
        <z-card-description zDescription="Select the option that best describes how you..." />
      </div>

      <div z-card-content class="flex flex-row flex-wrap gap-2">
        @for (option of options; track option) {
          <!-- A div, not a label: z-checkbox renders its own <label for>, so the
               visible text is a sibling label pointing at the same id instead of
               a second label nested inside the first. -->
          <div
            class="has-checked:bg-primary/5 has-checked:border-primary/30 dark:has-checked:bg-primary/10 dark:has-checked:border-primary/20 flex w-fit cursor-pointer items-center gap-0 overflow-hidden rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150 has-checked:gap-1.5 has-checked:pl-2"
          >
            <span
              class="inline-grid max-w-0 -translate-x-1 scale-0 transition-all duration-150 has-checked:max-w-4 has-checked:translate-x-0 has-checked:scale-100"
            >
              <z-checkbox
                class="rounded-full"
                [zId]="checkboxId(option)"
                [ngModel]="selected().includes(option)"
                (ngModelChange)="toggle(option)"
              />
            </span>
            <label class="cursor-pointer whitespace-nowrap" [for]="checkboxId(option)">{{ option }}</label>
          </div>
        }
      </div>
    </z-card>
  `,
})
export class BlockFieldHearComponent {
  readonly options = ['Social Media', 'Search Engine', 'Referral', 'Other'] as const;
  readonly selected = signal<string[]>(['Social Media']);

  checkboxId(option: string): string {
    return `hear-${option.toLowerCase().replace(/\s+/g, '-')}`;
  }

  toggle(option: string): void {
    this.selected.update(prev => (prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]));
  }
}
