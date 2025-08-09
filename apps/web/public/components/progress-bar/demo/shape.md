```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  standalone: true,
  imports: [ZardProgressBarComponent],
  template: `
    <z-progress-bar [progress]="50" [zShape]="'default'"></z-progress-bar>
    <z-progress-bar [progress]="50" [zShape]="'circle'"></z-progress-bar>
    <z-progress-bar [progress]="50" [zShape]="'square'"></z-progress-bar>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoProgressBarShapeComponent {}

```