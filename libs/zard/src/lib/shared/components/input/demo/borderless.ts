import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-borderless',
  imports: [ZardInputDirective],
  template: `
    <input z-input zBorderless placeholder="Borderless" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputBorderlessComponent {}
