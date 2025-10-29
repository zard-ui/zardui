```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardEmptyComponent } from '../empty.component';

@Component({
  standalone: true,
  imports: [ZardEmptyComponent],
  template: ` <z-empty zIcon="inbox" zTitle="No data" zDescription="No data found"> </z-empty> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptySimpleComponent {}

```