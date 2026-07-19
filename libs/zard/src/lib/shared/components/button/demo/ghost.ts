import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-ghost',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="ghost">Ghost</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonGhostComponent {}
