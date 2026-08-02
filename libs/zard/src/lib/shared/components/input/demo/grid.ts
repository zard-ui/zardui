import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-grid',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="grid min-w-sm grid-cols-2">
      <div z-field>
        <label z-field-label for="first-name">First Name</label>
        <input z-input id="first-name" placeholder="Jordan" />
      </div>
      <div z-field>
        <label z-field-label for="last-name">Last Name</label>
        <input z-input id="last-name" placeholder="Lee" />
      </div>
    </div>
  `,
})
export class ZardDemoInputGridComponent {}
