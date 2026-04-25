import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-secondary',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="secondary">Secondary</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonSecondaryComponent {}
