import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';

const EXAMPLE_IMAGE = '/images/rick.svg';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar zSize="sm" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zSize="md" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
    <z-avatar zSize="lg" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE}', alt: '' }" />
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
export class ZardDemoAvatarSizeComponent {}
