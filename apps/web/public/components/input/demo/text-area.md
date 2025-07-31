```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <textarea z-input rows="8" cols="12" placeholder="Default"></textarea>
    <textarea zBorderless z-input rows="8" cols="12" placeholder="Borderless"></textarea>
  `,
})
export class ZardDemoInputTextAreaComponent {}

```