```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardKbdGroupComponent } from '../kbd-group.component';
import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-kbd-group',
  imports: [ZardKbdGroupComponent, ZardKbdComponent],
  template: `
    <z-kbd-group>
      <z-kbd>Ctrl</z-kbd>
      <span>+</span>
      <z-kbd>C</z-kbd>
    </z-kbd-group>
  `,
})
export class ZardDemoKbdGroupComponent {}

```