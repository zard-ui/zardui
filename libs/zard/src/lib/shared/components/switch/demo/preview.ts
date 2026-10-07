import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-preview',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch zId="airplane-mode">Airplane Mode</z-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchPreviewComponent {}
