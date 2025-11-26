import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipDirective } from '../../tooltip/tooltip';
import { ZardKbdGroupComponent } from '../kbd-group.component';
import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-kbd-tooltip',
  imports: [ZardButtonComponent, ZardTooltipDirective, ZardKbdGroupComponent, ZardKbdComponent],
  standalone: true,
  template: `
    <button type="button" z-button [zTooltip]="shortcutTip">Save</button>

    <ng-template #shortcutTip>
      Press
      <z-kbd-group>
        <z-kbd class="bg-blue-400 text-white">Ctrl</z-kbd>
        <span>+</span>
        <z-kbd class="bg-blue-400 text-white">S</z-kbd>
      </z-kbd-group>
      to save
    </ng-template>
  `,
})
export class ZardDemoKbdTooltipComponent {}
