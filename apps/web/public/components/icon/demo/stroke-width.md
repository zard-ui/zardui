```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  selector: 'z-demo-icon-stroke-width',
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" [zStrokeWidth]="1" />
        <span class="text-muted-foreground text-xs">Stroke 1</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" [zStrokeWidth]="2" />
        <span class="text-muted-foreground text-xs">Stroke 2</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" [zStrokeWidth]="3" />
        <span class="text-muted-foreground text-xs">Stroke 3</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" [zStrokeWidth]="4" />
        <span class="text-muted-foreground text-xs">Stroke 4</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoIconStrokeWidthComponent {}

```