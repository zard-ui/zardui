import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardArrowUpIcon, zardPopcornIcon } from '@/shared/core/icons-registry';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline">Button</button>
    <button z-button zType="outline"><ng-icon name="arrow-up" /></button>
    <button z-button zType="outline">
      Button
      <ng-icon name="popcorn" />
    </button>
  `,
  viewProviders: [provideIcons({ arrowUp: zardArrowUpIcon, popcorn: zardPopcornIcon })],
})
export class ZardDemoButtonDefaultComponent {}
