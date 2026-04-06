import { Component } from '@angular/core';

import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-group',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-avatar-group class="grayscale">
        <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
        <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
        <z-avatar zSrc="https://github.com/Luizgomess.png" zFallback="LU" />
      </z-avatar-group>

      <z-avatar-group zOrientation="vertical" class="grayscale">
        <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
        <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" />
        <z-avatar zSrc="https://github.com/Luizgomess.png" zFallback="LU" />
      </z-avatar-group>
    </div>
  `,
})
export class ZardDemoAvatarGroupComponent {}
