import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ZardButtonGroupComponent,
  ZardButtonGroupTextDirective,
} from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-button-group-text',
  imports: [ZardButtonGroupComponent, ZardButtonGroupTextDirective, ZardInputComponent],
  template: `
    <z-button-group>
      <label z-button-group-text for="button-group-text-name">Text</label>
      <input z-input id="button-group-text-name" placeholder="Type something here..." />
    </z-button-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonGroupTextComponent {}
