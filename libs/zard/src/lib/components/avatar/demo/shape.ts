import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zShape="default" [zImage]="zImageDefault" />
    <z-avatar zShape="square" [zImage]="zImageDefault" />
    <z-avatar zShape="circle" [zImage]="zImageDefault" />
  `,
})
export class ZardDemoAvatarShapeComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
    url: 'https://github.com/shadcn.png',
    alt: 'ZadUI',
  };
}
