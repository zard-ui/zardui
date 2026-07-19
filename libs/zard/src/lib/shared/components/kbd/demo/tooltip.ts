import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardButtonGroupComponent } from '@/shared/components/button-group';
import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';
import { ZardTooltipDirective } from '@/shared/components/tooltip';

@Component({
  selector: 'z-demo-kbd-tooltip',
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardTooltipDirective,
    ZardKbdGroupComponent,
    ZardKbdComponent,
  ],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline" [zTooltip]="saveTip">Save</button>
      <button type="button" z-button zType="outline" [zTooltip]="printTip">Print</button>
    </z-button-group>

    <ng-template #saveTip>
      Save changes
      <z-kbd>S</z-kbd>
    </ng-template>

    <ng-template #printTip>
      Print document
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <z-kbd>P</z-kbd>
      </z-kbd-group>
    </ng-template>
  `,
})
export class ZardDemoKbdTooltipComponent {}
