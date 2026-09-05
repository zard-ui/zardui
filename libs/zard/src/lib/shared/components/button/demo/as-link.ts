import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-as-link',
  imports: [ZardButtonComponent],
  template: `
    <a z-button zSize="sm" zType="secondary" href="/login">Login</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonAsLinkComponent {}
