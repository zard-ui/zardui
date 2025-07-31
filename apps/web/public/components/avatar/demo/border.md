```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zImage]="zImageDefault" zBorder />
    <z-avatar zType="destructive" [zImage]="zImageDefault" zBorder />
    <z-avatar zType="outline" [zImage]="zImageDefault" zBorder />
    <z-avatar zType="secondary" [zImage]="zImageDefault" zBorder />
    <z-avatar zType="ghost" [zImage]="zImageDefault" zBorder />
  `,
})
export class ZardDemoAvatarBorderComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
    url: '/images/avatar/imgs/avatar_image.jpg',
    alt: 'ZadUI',
  };
}

```