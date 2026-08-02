import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-invalid',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-invalid="true">
      <label z-field-label for="textarea-invalid">Message</label>
      <textarea z-textarea id="textarea-invalid" placeholder="Type your message here." aria-invalid="true"></textarea>
      <p z-field-description>Please enter a valid message.</p>
    </div>
  `,
})
export class ZardDemoTextareaInvalidComponent {}
