```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardKbdGroupComponent, ZardKbdComponent } from '@ngzard/ui/kbd';

@Component({
  selector: 'z-demo-kbd-group',
  imports: [ZardKbdGroupComponent, ZardKbdComponent],
  standalone: true,
  template: `
    <z-kbd-group>
      Use
      <z-kbd>Ctrl + K</z-kbd>
      or
      <z-kbd>Ctrl + O</z-kbd>
      to open menu
    </z-kbd-group>
  `,
})
export class ZardDemoKbdGroupComponent {}

```