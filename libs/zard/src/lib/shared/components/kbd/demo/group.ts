import { Component } from '@angular/core';

import { ZardKbdGroupComponent } from '../kbd-group.component';
import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-kbd-group',
  imports: [ZardKbdGroupComponent, ZardKbdComponent],
  template: `
    <z-kbd-group class="text-muted-foreground text-sm">
      Use
      <z-kbd>Ctrl + B</z-kbd>
      <z-kbd>Ctrl + K</z-kbd>
      to open command palette
    </z-kbd-group>
  `,
})
export class ZardDemoKbdGroupComponent {}
