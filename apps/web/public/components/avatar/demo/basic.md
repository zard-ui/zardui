```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardAvatarGroupComponent } from '../avatar-group.component';
import { ZardAvatarComponent } from '../avatar.component';

@Component({
  selector: 'z-demo-avatar-basic',
  standalone: true,
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent],
  template: `
    <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" [zSize]="32" />
    <z-avatar zSrc="error-image.png" zFallback="ZA" zSize="sm" />

    <z-avatar-group>
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="JD" zSize="sm" />
      <z-avatar zSrc="https://github.com/srizzon.png" zFallback="SA" zSize="sm" />
      <z-avatar zSrc="https://github.com/Luizgomess.png" zFallback="LU" zSize="sm" />
    </z-avatar-group>
  `,
})
export class ZardDemoAvatarBasicComponent {}

```