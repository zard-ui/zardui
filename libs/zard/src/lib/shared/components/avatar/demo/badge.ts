import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-badge',
  imports: [ZardAvatarComponent],
  template: `
    <div class="flex gap-3">
      <z-avatar
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Image"
        zBadgeClass="bg-green-600 dark:bg-green-800"
      />
      <z-avatar
        class="grayscale"
        [zShowBadge]="true"
        zSrc="/images/avatar/imgs/avatar_image.jpg"
        zAlt="Image"
        zBadgeIcon="lucidePlus"
      />
    </div>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoAvatarBadgeComponent {}
