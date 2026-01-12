import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-size',
  imports: [ZardInputDirective],
  template: `
    <input z-input zSize="sm" placeholder="small size" />
    <input z-input zSize="default" placeholder="default size" />
    <input z-input zSize="lg" placeholder="large size" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputSizeComponent {}
