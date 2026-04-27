import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-field-switch',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div class="flex w-full min-w-md justify-center">
      <div z-field zOrientation="horizontal" class="w-fit">
        <label z-field-label for="2fa">Multi-factor authentication</label>
        <z-switch zId="2fa" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldSwitchComponent {}
