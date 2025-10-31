```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-default',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `<z-empty />`,
})
export class ZardDemoEmptyDefaultComponent {}

```