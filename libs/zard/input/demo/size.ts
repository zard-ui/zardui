import { Component } from '@angular/core';

import { ZardInputDirective } from '@ngzard/ui/input';

@Component({
  selector: 'z-demo-input-size',
  imports: [ZardInputDirective],
  standalone: true,
  template: `
    <input z-input zSize="sm" placeholder="small size" />
    <input z-input zSize="default" placeholder="default size" />
    <input z-input zSize="lg" placeholder="large size" />
  `,
})
export class ZardDemoInputSizeComponent {}
