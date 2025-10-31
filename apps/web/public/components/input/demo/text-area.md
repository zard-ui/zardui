```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-text-area',
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <textarea z-input rows="8" cols="12" placeholder="Default"></textarea>
    <textarea zBorderless z-input rows="8" cols="12" placeholder="Borderless"></textarea>
  `,
})
export class ZardDemoInputTextAreaComponent {}

```