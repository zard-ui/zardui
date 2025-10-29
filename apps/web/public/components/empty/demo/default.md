```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-default',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: ` <z-empty zIcon="inbox" zTitle="No data" zDescription="No data found"> </z-empty> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyDefaultComponent {}

```