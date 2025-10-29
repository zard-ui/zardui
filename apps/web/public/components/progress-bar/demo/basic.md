```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  selector: 'z-demo-progress-bar-basic',
  standalone: true,
  imports: [ZardProgressBarComponent],
  template: ` <z-progress-bar [progress]="50"></z-progress-bar> `,
})
export class ZardDemoProgressBarBasicComponent {}

```