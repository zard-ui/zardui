import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

@Component({
  selector: 'z-block-field-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <!-- A div, not a label: z-checkbox already renders its own label[for], and
         nesting one inside another is invalid. The [&>label]:flex-1 utility
         stretches that inner label across the row so the whole card stays
         clickable. -->
    <div
      class="has-checked:border-primary/30 has-checked:bg-primary/5 dark:has-checked:border-primary/20 dark:has-checked:bg-primary/10 flex w-full cursor-pointer items-center justify-start rounded-lg border p-2.5 transition-colors"
    >
      <z-checkbox class="w-full [&>label]:flex-1" [ngModel]="true">I agree to the terms and conditions</z-checkbox>
    </div>
  `,
})
export class BlockFieldCheckboxComponent {}
