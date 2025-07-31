```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zLoading [zImage]="zImageDefault" />
    <z-avatar zLoading zType="destructive" [zImage]="zImageDefault" />
    <z-avatar zLoading zType="outline" [zImage]="zImageDefault" />
    <z-avatar zLoading zType="secondary" [zImage]="zImageDefault" />
    <z-avatar zLoading zType="ghost" [zImage]="zImageDefault" />
  `,
})
export class ZardDemoAvatarLoadingComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
    url: '/images/avatar/imgs/avatar_image.jpg',
    alt: 'ZadUI',
  };
}

```