import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-link',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="link">Link</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonLinkComponent {}
