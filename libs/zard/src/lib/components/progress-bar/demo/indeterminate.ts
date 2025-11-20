import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  selector: 'z-demo-progress-bar-indeterminate',
  imports: [ZardProgressBarComponent],
  standalone: true,
  template: ` <z-progress-bar [progress]="50" zShape="square" [zIndeterminate]="true" /> `,
})
export class ZardDemoProgressBarIndeterminateComponent {}
