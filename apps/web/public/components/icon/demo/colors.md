```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  selector: 'z-demo-icon-colors',
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-icon zType="heart" class="text-destructive" />
      <z-icon zType="circle-check" class="text-green-500" />
      <z-icon zType="triangle-alert" class="text-orange-500" />
      <z-icon zType="info" class="text-blue-500" />
      <z-icon zType="star" class="text-yellow-500" />
      <z-icon zType="zap" class="text-purple-500" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoIconColorsComponent {}

```