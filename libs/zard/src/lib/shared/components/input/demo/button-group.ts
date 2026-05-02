import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-button-group',
  imports: [ZardInputComponent, ZardButtonComponent, ZardButtonGroupComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-button-group">Search</label>
      <z-button-group>
        <input z-input id="input-button-group" placeholder="Type to search..." />
        <button z-button zType="outline">Search</button>
      </z-button-group>
    </div>
  `,
})
export class ZardDemoInputButtonGroupComponent {}
