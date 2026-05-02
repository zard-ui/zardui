import { Component } from '@angular/core';

import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-basic',
  imports: [ZardInputComponent],
  template: `
    <input z-input placeholder="Enter text" class="w-72" />
  `,
})
export class ZardDemoInputBasicComponent {}
