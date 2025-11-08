import { Component } from '@angular/core';

import { ZardKbdGroupComponent } from '../kbd-group.component';
import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-kbd-group',
  imports: [ZardKbdGroupComponent, ZardKbdComponent],
  template: `
    <z-kbd-group>
      Use <z-kbd>Ctrl + K</z-kbd> or <z-kbd>Ctrl + O</z-kbd>
      to open menu
    </z-kbd-group>
  `,
})
export class ZardDemoKbdGroupComponent {}
