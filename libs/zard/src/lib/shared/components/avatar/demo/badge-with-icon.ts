import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-badge-with-icon',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Verified user"
        zBadgeIcon="lucideBadgeCheck"
        zBadgeClass="bg-blue-600 dark:bg-blue-700"
      />
      <z-avatar
        class="grayscale"
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="New member"
        zBadgeIcon="lucidePlus"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucidePlus })],
})
export class ZardDemoAvatarBadgeWithIconComponent {}
