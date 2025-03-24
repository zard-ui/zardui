import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';
import { EXAMPLE_IMAGE_URL } from './utils';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zShape="default" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
    <z-avatar zShape="square" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
    <z-avatar zShape="circle" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
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
export class ZardDemoAvatarShapeComponent {}
