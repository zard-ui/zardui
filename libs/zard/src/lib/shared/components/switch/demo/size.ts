import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-size',
  imports: [ZardSwitchComponent],
  template: `
    <div class="grid w-full min-w-sm items-center justify-center gap-6">
      <z-switch zSize="sm">Small</z-switch>
      <z-switch>Default</z-switch>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchSizeComponent {}
