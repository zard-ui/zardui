```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '@ngzard/ui/progress-bar';

@Component({
  selector: 'z-demo-progress-bar-shape',
  imports: [ZardProgressBarComponent],
  standalone: true,
  template: `
    <z-progress-bar [progress]="50" zShape="default" />
    <z-progress-bar [progress]="50" zShape="circle" />
    <z-progress-bar [progress]="50" zShape="square" />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  `,
})
export class ZardDemoProgressBarShapeComponent {}

```