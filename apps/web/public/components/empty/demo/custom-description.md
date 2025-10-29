```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-custom-description',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `<z-empty zDescription="No data found" />`,
})
export class ZardDemoEmptyCustomDescriptionComponent {}

```