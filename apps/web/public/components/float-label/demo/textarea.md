```angular-ts showLineNumbers copyButton
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { Component } from '@angular/core';


@Component({
  selector: 'z-demo-input-status',
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <input z-input zStatus="error" placeholder="Error" />
    <input z-input zStatus="warning" placeholder="Warning" />
    <input z-input zStatus="success" placeholder="Success" />
  `,
})
export class ZardDemoInputStatusComponent { }

```