import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-default',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-demo-api-key">API Key</label>
      <input z-input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <p z-field-description>Your API key is encrypted and stored securely.</p>
    </div>
  `,
})
export class ZardDemoInputDefaultComponent {}
