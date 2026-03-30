import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

@Component({
  selector: 'z-block-field-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <label
      class="has-checked:border-primary/30 has-checked:bg-primary/5 dark:has-checked:border-primary/20 dark:has-checked:bg-primary/10 flex w-full cursor-pointer items-center rounded-lg border p-2.5 transition-colors"
    >
      <z-checkbox [ngModel]="true">I agree to the terms and conditions</z-checkbox>
    </label>
  `,
})
export class BlockFieldCheckboxComponent {}
