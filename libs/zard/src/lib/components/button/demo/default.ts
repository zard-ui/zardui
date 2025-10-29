import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  standalone: true,
  imports: [ZardButtonComponent, ZardIconComponent],
  template: `
    <button z-button zType="outline">Button</button>
    <button z-button zType="outline"><i z-icon zType="arrow-up"></i></button>
    <button z-button zType="outline">Button <i z-icon zType="popcorn"></i></button>
  `,
})
export class ZardDemoButtonDefaultComponent {}
