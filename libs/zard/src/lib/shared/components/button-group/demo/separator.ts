import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent, ZardButtonGroupSeparatorComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-separator',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardButtonGroupSeparatorComponent],
  template: `
    <z-button-group>
      <button type="button" z-button zSize="sm" zType="secondary">Copy</button>
      <z-button-group-separator />
      <button type="button" z-button zSize="sm" zType="secondary">Paste</button>
    </z-button-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonGroupSeparatorComponent {}
