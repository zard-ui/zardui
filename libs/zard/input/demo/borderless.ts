import { Component } from '@angular/core';

import { ZardInputDirective } from '@ngzard/ui/input';

@Component({
  selector: 'z-demo-input-borderless',
  imports: [ZardInputDirective],
  standalone: true,
  template: `
    <input z-input zBorderless placeholder="Borderless" />
  `,
})
export class ZardDemoInputBorderlessComponent {}
