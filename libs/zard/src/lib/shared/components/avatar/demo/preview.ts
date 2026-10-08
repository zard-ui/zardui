import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarGroupCountComponent } from '@/shared/components/avatar/avatar-group-count.component';
import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-preview',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardAvatarGroupCountComponent],
  template: `
    <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Rick Sanchez" zFallback="RS" class="grayscale" />
      <z-avatar
        zSrc="https://github.com/Luizgomess.png"
        zAlt="@Luizgomess"
        zFallback="LG"
        [zShowBadge]="true"
        zBadgeClass="bg-green-600 dark:bg-green-800"
      />
      <z-avatar-group class="grayscale">
        <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Rick Sanchez" zFallback="RS" />
        <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        <z-avatar zSrc="https://github.com/ribeiromatheuss.png" zAlt="@ribeiromatheuss" zFallback="MR" />
        <z-avatar-group-count [zCount]="3" />
      </z-avatar-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarPreviewComponent {}
