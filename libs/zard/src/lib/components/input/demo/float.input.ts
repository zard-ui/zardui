import { Component } from '@angular/core';

import { ZardFloatLabelComponent } from '../float.label.component';
import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-float-input',
  standalone: true,
  imports: [ZardInputDirective, ZardFloatLabelComponent],
  template: `
    <zard-float-label>
      <input z-input />
      <label>Float Label</label>
    </zard-float-label>
  `,
})
export class ZardFloatLabelDemoComponent {}
