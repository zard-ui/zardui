```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zSize="sm" [zImage]="zImageDefault" />
    <z-avatar zSize="md" [zImage]="zImageDefault" />
    <z-avatar zSize="lg" [zImage]="zImageDefault" />
  `,
})
export class ZardDemoAvatarSizeComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
    url: '/images/avatar/imgs/avatar_image.jpg',
    alt: 'ZadUI',
  };
}

```