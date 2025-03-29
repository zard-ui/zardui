import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../avatar.component';
import { EXAMPLE_IMAGE_URL } from './utils';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
    <z-avatar zType="destructive" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
    <z-avatar zType="outline" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
    <z-avatar zType="secondary" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
    <z-avatar zType="ghost" [zImage]="{ fallback: 'ZA', url: '${EXAMPLE_IMAGE_URL}', alt: '' }" />
  `,
})
export class ZardDemoAvatarBasicWithImageComponent {}
