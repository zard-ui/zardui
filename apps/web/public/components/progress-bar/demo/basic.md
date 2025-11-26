```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '@ngzard/ui/progress-bar';

@Component({
  selector: 'z-demo-progress-bar-basic',
  imports: [ZardProgressBarComponent],
  standalone: true,
  template: `
    <z-progress-bar [progress]="50" />
  `,
})
export class ZardDemoProgressBarBasicComponent {}

```