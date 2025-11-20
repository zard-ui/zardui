import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  selector: 'z-demo-avatar-status',
  imports: [ZardAvatarComponent],
  standalone: true,
  template: `
    <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="online" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="offline" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="doNotDisturb" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="away" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
  `,
})
export class ZardDemoAvatarStatusComponent {}
