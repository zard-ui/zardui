import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-disabled',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-disabled="true">
      <label z-field-label for="textarea-disabled">Message</label>
      <textarea z-textarea id="textarea-disabled" placeholder="Type your message here." disabled></textarea>
    </div>
  `,
})
export class ZardDemoTextareaDisabledComponent {}
