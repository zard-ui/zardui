import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  standalone: true,
  imports: [ZardProgressBarComponent],
  template: ` <z-progress-bar [progress]="50"></z-progress-bar> `,
})
export class ZardDemoProgressBarBasicComponent {}
