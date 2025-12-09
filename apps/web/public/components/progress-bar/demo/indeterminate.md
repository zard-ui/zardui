```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  selector: 'z-demo-progress-bar-indeterminate',
  imports: [ZardProgressBarComponent],
  template: `
    <z-progress-bar [progress]="50" zShape="square" [zIndeterminate]="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressBarIndeterminateComponent {}

```