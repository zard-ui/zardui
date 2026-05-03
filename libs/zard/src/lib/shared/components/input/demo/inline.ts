import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-inline',
  imports: [ZardInputComponent, ZardButtonComponent, ...ZardFieldImports],
  template: `
    <div z-field zOrientation="horizontal" class="w-80">
      <input z-input type="search" placeholder="Search..." />
      <button z-button>Search</button>
    </div>
  `,
})
export class ZardDemoInputInlineComponent {}
