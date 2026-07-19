import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-outline',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline">Outline</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonOutlineComponent {}
