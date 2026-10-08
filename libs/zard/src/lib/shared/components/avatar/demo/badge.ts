import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-badge',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Online"
        zBadgeClass="bg-green-600 dark:bg-green-500"
      />
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Away"
        zBadgeClass="bg-yellow-500 dark:bg-yellow-600"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarBadgeComponent {}
