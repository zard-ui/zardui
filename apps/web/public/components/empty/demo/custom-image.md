```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-custom-image',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `<z-empty zImage="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />`,
})
export class ZardDemoEmptyCustomImageComponent {}

```