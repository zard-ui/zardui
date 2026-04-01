import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

@Component({
  selector: 'z-block-field-hear',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardComponent, ZardCheckboxComponent, FormsModule],
  template: `
    <z-card zTitle="How did you hear about us?" class="gap-2">
      <p class="text-muted-foreground -mt-3 mb-4 line-clamp-1 text-sm leading-normal font-normal">
        Select the option that best describes how you heard about us
      </p>
      <div class="flex flex-row flex-wrap gap-2">
        @for (option of options; track option) {
          <label
            class="has-checked:bg-primary/5 has-checked:border-primary/30 dark:has-checked:bg-primary/10 dark:has-checked:border-primary/20 flex w-fit cursor-pointer items-center gap-0 overflow-hidden rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150 has-checked:gap-1.5 has-checked:pl-2"
          >
            <span
              class="inline-grid max-w-0 -translate-x-1 scale-0 transition-all duration-150 has-checked:max-w-4 has-checked:translate-x-0 has-checked:scale-100"
            >
              <z-checkbox zShape="circle" [ngModel]="selected().includes(option)" (ngModelChange)="toggle(option)" />
            </span>
            <span class="whitespace-nowrap">{{ option }}</span>
          </label>
        }
      </div>
    </z-card>
  `,
})
export class BlockFieldHearComponent {
  readonly options = ['Social Media', 'Search Engine', 'Referral', 'Other'] as const;
  readonly selected = signal<string[]>(['Social Media']);

  toggle(option: string): void {
    this.selected.update(prev => (prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]));
  }
}
