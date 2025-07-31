```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zImage]="zImageDefault" />
    <z-avatar zStatus="online" [zImage]="zImageDefault" />
    <z-avatar zStatus="offline" [zImage]="zImageDefault" />
    <z-avatar zStatus="doNotDisturb" [zImage]="zImageDefault" />
    <z-avatar zStatus="away" [zImage]="zImageDefault" />
    <z-avatar zStatus="invisible" [zImage]="zImageDefault" />
  `,
})
export class ZardDemoAvatarStatusComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
    url: '/images/avatar/imgs/avatar_image.jpg',
    alt: 'ZadUI',
  };
}

```