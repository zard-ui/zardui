import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-custom-image',
  standalone: true,
  imports: [ZardButtonComponent, ZardEmptyComponent],
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
