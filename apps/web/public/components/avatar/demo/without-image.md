```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zImage]="zImageDefault" />
    <z-avatar zType="destructive" [zImage]="zImageDefault" />
    <z-avatar zType="outline" [zImage]="zImageDefault" />
    <z-avatar zType="secondary" [zImage]="zImageDefault" />
    <z-avatar zType="ghost" [zImage]="zImageDefault" />
  `,
})
export class ZardDemoAvatarWithoutImageComponent {
  readonly zImageDefault = {
    fallback: 'ZA',
  };
}

```