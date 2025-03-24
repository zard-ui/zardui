import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

const EXAMPLE_IMAGE = '/images/rick.svg';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zType="destructive" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zType="outline" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zType="secondary" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zType="ghost" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
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
export class ZardDemoAvatarBasicWithImageComponent {}
