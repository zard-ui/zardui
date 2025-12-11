import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  selector: 'z-demo-progress-bar-basic',
  imports: [ZardProgressBarComponent],
  template: `
    <z-progress-bar [progress]="50" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressBarBasicComponent {}
