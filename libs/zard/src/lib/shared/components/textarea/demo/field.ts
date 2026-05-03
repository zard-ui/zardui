import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-field',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="textarea-message">Message</label>
      <p z-field-description>Enter your message below.</p>
      <textarea z-textarea id="textarea-message" placeholder="Type your message here."></textarea>
    </div>
  `,
})
export class ZardDemoTextareaFieldComponent {}
