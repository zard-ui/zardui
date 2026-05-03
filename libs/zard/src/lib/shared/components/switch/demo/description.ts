import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-description',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" class="max-w-sm">
      <div z-field-content>
        <label z-field-label for="switch-focus-mode">Share across devices</label>
        <p z-field-description>Focus is shared across devices, and turns off when you leave the app.</p>
      </div>
      <z-switch zId="switch-focus-mode" />
    </div>
  `,
})
export class ZardDemoSwitchDescriptionComponent {}
