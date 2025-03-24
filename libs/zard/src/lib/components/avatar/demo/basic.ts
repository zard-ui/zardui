import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zImage]="{ fallback: 'ZA' }" />
    <z-avatar zType="destructive" [zImage]="{ fallback: 'ZA' }" />
    <z-avatar zType="outline" [zImage]="{ fallback: 'ZA' }" />
    <z-avatar zType="secondary" [zImage]="{ fallback: 'ZA' }" />
    <z-avatar zType="ghost" [zImage]="{ fallback: 'ZA' }" />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoAvatarBasicComponent {}
