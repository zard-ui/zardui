import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

@Component({
  selector: 'z-block-field-hear',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardComponent, ZardCheckboxComponent],
  template: `
    <z-card zTitle="How did you hear about us?">
      <p class="text-muted-foreground -mt-3 mb-4 line-clamp-1 text-sm leading-normal font-normal">
        Select all that apply.
      </p>
      <div class="flex flex-row flex-wrap gap-2 [--radius:9999rem]">
        @for (option of options; track option) {
          <label
            class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
          >
            <z-checkbox class="hidden" />
            <span>{{ option }}</span>
          </label>
        }
      </div>
    </z-card>
  `,
})
export class BlockFieldHearComponent {
  readonly options = ['Social Media', 'Search Engine', 'Referral', 'Other'] as const;
}
