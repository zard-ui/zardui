import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-field-textarea',
  imports: [...ZardFieldImports, ZardTextareaComponent],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="feedback">Feedback</label>
            <textarea z-textarea id="feedback" placeholder="Your feedback helps us improve..." rows="4"></textarea>
            <p z-field-description>Share your thoughts about our service.</p>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldTextareaComponent {}
