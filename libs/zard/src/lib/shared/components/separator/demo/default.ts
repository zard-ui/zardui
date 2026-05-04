import { Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-default',
  imports: [ZardSeparatorComponent],
  standalone: true,
  template: `
    <div class="flex flex-col">
      <p>Before separator</p>
      <z-separator />
      <p>After separator</p>
    </div>
  `,
})
export class ZardDemoSeparatorDefaultComponent {}
