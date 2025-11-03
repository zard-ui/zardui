```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-loader-default',
  standalone: true,
  imports: [ZardKbdComponent],
  template: `<z-kbd>Ctrl</z-kbd> + <z-kbd>A</z-kbd>`,
})
export class ZardDemoKbdDefaultComponent {}
```