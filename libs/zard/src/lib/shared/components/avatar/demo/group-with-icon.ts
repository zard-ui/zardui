import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck } from '@ng-icons/lucide';

import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-group-with-icon',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent],
  template: `
    <z-avatar-group class="grayscale">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
      <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
      <z-avatar
        zSrc="https://github.com/Luizgomess.png"
        zFallback="LU"
        [zShowBadge]="true"
        zBadgeIcon="lucideBadgeCheck"
        zBadgeClass="bg-blue-600 dark:bg-blue-700"
      />
    </z-avatar-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck })],
})
export class ZardDemoAvatarGroupWithIconComponent {}
