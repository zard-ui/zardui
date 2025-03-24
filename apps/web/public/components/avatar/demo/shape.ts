import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

const EXAMPLE_IMAGE = '/images/rick.svg';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zShape="default" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zShape="square" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zShape="circle" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
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
