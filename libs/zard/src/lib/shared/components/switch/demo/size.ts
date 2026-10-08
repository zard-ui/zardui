import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-size',
  imports: [ZardSwitchComponent],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <div class="flex items-center gap-6">
        <z-switch zSize="sm">Small</z-switch>
        <z-switch zSize="sm" [zChecked]="true">Small (checked)</z-switch>
      </div>
      <div class="flex items-center gap-6">
        <z-switch>Default</z-switch>
        <z-switch [zChecked]="true">Default (checked)</z-switch>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchSizeComponent {}
