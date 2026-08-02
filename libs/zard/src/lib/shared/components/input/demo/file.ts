import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-file',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="picture">Picture</label>
      <input z-input id="picture" type="file" />
      <p z-field-description>Select a picture to upload.</p>
    </div>
  `,
})
export class ZardDemoInputFileComponent {}
