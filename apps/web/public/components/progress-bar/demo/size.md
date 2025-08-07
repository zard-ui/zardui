```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  standalone: true,
  imports: [ZardProgressBarComponent],
  template: `
    <z-progress-bar [progress]="50" [zSize]="'default'"></z-progress-bar>
    <z-progress-bar [progress]="50" [zSize]="'sm'"></z-progress-bar>
    <z-progress-bar [progress]="50" [zSize]="'lg'"></z-progress-bar>
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
export class ZardDemoProgressBarSizeComponent {}

```