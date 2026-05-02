import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputDirective } from '@/shared/components/input/input.directive';

@Component({
  selector: 'z-demo-field-textarea',
  imports: [...ZardFieldImports, ZardInputDirective],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="feedback">Feedback</label>
            <textarea
              z-input
              id="feedback"
              placeholder="Your feedback helps us improve..."
              zSize="sm"
              rows="4"
            ></textarea>
            <p z-field-description>Share your thoughts about our service.</p>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldTextareaComponent {}
