import { Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  selector: 'z-demo-progress-bar-size',
  imports: [ZardProgressBarComponent],
  standalone: true,
  template: `
    <z-progress-bar [progress]="50" zSize="default" />
    <z-progress-bar [progress]="50" zSize="sm" />
    <z-progress-bar [progress]="50" zSize="lg" />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  `,
})
export class ZardDemoProgressBarSizeComponent {}
