import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zLoading]="9999999999" [zImage]="zImageDefault" />
    <z-avatar [zLoading]="9999999999" zType="destructive" [zImage]="zImageDefault" />
    <z-avatar [zLoading]="9999999999" zType="outline" [zImage]="zImageDefault" />
    <z-avatar [zLoading]="9999999999" zType="secondary" [zImage]="zImageDefault" />
    <z-avatar [zLoading]="9999999999" zType="ghost" [zImage]="zImageDefault" />
  `,
})
export class ZardDemoAvatarLoadingComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
    url: '/images/avatar/imgs/avatar_image.jpg',
    alt: 'ZadUI',
  };
}
