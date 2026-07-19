import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-custom-image',
  imports: [ZardAvatarComponent, ZardButtonComponent, ZardEmptyComponent],
  template: `
    <z-empty
      [zImage]="customImage"
      zTitle="User Offline"
      zDescription="This user is currently offline. You can leave a message to notify them or try again later."
      [zActions]="[actionPrimary]"
    />

    <ng-template #customImage>
      <z-avatar
        zSize="lg"
        zSrc="images/avatar/imgs/avatar_image.jpg"
        zFallback="CN"
        zAlt="User avatar"
        class="grayscale"
      />
    </ng-template>

    <ng-template #actionPrimary>
      <button type="button" z-button>Leave Message</button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyCustomImageComponent {}
