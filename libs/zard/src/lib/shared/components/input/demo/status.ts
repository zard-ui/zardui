import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-status',
  imports: [ZardInputDirective],
  template: `
    <input z-input zStatus="error" placeholder="Error" />
    <input z-input zStatus="warning" placeholder="Warning" />
    <input z-input zStatus="success" placeholder="Success" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputStatusComponent {}
