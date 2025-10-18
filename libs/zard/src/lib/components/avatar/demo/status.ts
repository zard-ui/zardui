import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="online" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="offline" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="doNotDisturb" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="away" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
    <z-avatar zStatus="invisible" zSrc="/images/avatar/imgs/avatar_image.jpg" zAlt="Image" />
  `,
})
export class ZardDemoAvatarStatusComponent {}
