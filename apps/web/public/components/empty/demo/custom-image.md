```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardEmptyComponent } from '@ngzard/ui/empty';

@Component({
  selector: 'z-demo-empty-custom-image',
  imports: [ZardButtonComponent, ZardEmptyComponent],
  standalone: true,
  template: `
    <z-empty
      zImage="images/avatar/imgs/avatar_image.jpg"
      zTitle="User Offline"
      zDescription="This user is currently offline. You can leave a message to notify them or try again later."
      [zActions]="[actionPrimary]"
      class="[&_img]:size-12 [&_img]:rounded-full [&_img]:grayscale"
    />

    <ng-template #actionPrimary>
      <button z-button>Leave Message</button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyCustomImageComponent {}

```