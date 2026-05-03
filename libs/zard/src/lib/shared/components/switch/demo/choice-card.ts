import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-choice-card',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field-group class="w-full min-w-sm">
      <label z-field-label for="switch-share">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Share across devices</div>
            <p z-field-description>Focus is shared across devices, and turns off when you leave the app.</p>
          </div>
          <z-switch zId="switch-share" />
        </div>
      </label>
      <label z-field-label for="switch-notifications">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>Receive notifications when focus mode is enabled or disabled.</p>
          </div>
          <z-switch zId="switch-notifications" [zChecked]="true" />
        </div>
      </label>
    </div>
  `,
})
export class ZardDemoSwitchChoiceCardComponent {}
