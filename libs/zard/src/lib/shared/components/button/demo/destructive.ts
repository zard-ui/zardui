import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-destructive',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="destructive">Destructive</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonDestructiveComponent {}
