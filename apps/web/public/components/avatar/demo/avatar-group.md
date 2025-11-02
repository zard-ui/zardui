```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';
import { ZardAvatarGroupComponent } from '../avatar-group.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent],
  template: `
    <z-avatar-group>
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" />
      <z-avatar zSrc="/images/avatar/imgs/avatar_image_2.jpg" zFallback="AB" />
      <z-avatar zSrc="/images/avatar/imgs/avatar_image_3.jpg" zFallback="CD" />
      <z-avatar zFallback="EF" />
    </z-avatar-group>
  `,
})
export class ZardDemoAvatarGroupComponent {}

```
