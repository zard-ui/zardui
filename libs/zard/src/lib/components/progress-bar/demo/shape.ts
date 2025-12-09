import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardProgressBarComponent } from '../progress-bar.component';

@Component({
  selector: 'z-demo-progress-bar-shape',
  imports: [ZardProgressBarComponent],
  template: `
    <z-progress-bar [progress]="50" zShape="default" zType="destructive" />
    <z-progress-bar [progress]="50" zType="accent" />
    <z-progress-bar [progress]="50" zShape="square" />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressBarShapeComponent {}
